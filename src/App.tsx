import { useState } from "react";
import { useOutages } from "./hooks/useOutages";
import { useNow } from "./hooks/useNow";
import {
  toOutageIntervals,
  getPowerStatus,
  formatMinutes,
  formatDuration,
} from "./utils/schedule";
import { GroupSelect } from "./components/GroupSelect";

const STORAGE_KEY = "selectedGroup";

function App() {
  const { data, loading, error, fromCache } = useOutages();
  const now = useNow();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  function handleGroupChange(group: string) {
    setSelectedGroup(group);
    try {
      localStorage.setItem(STORAGE_KEY, group);
    } catch {
      // сховище може бути недоступне, це не критично
    }
  }

  if (loading && !data) {
    return <p className="message">Завантаження...</p>;
  }
  if (!data) {
    return <p className="message">Помилка: {error ?? "даних немає"}</p>;
  }

  const day = Object.values(data.fact.data)[0];
  if (!day) {
    return <p className="message">На сьогодні даних ще немає</p>;
  }

  const groups = Object.keys(day);
  const group =
    selectedGroup && groups.includes(selectedGroup) ? selectedGroup : groups[0];

  const intervals = toOutageIntervals(day[group]);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const status = getPowerStatus(intervals, nowMinutes);

  const updated = new Date(data.lastUpdated);
  const isOldDay = updated.toDateString() !== now.toDateString();

  let mainText: string;
  let subText: string;
  if (status.isOff) {
    mainText = "Світла немає";
    subText = `Увімкнуть о ${formatMinutes(status.until)} (через ${formatDuration(status.until - nowMinutes)})`;
  } else if (status.next !== null) {
    mainText = "Світло є";
    subText = `Наступне відключення о ${formatMinutes(status.next)} (через ${formatDuration(status.next - nowMinutes)})`;
  } else {
    mainText = "Світло є";
    subText = "Більше відключень сьогодні не заплановано";
  }

  return (
    <main className="app">
      <h1 className="title">Графік відключень</h1>

      {fromCache && error && (
        <div className="warning">
          ⚠️ Немає звʼязку з джерелом. Показано збережені дані.
          {isOldDay && " Вони можуть бути застарілими: оновлення було не сьогодні."}
        </div>
      )}

      <GroupSelect groups={groups} value={group} onChange={handleGroupChange} />

      <section className={`status ${status.isOff ? "status--off" : "status--on"}`}>
        <p className="status__main">{mainText}</p>
        <p className="status__sub">{subText}</p>
      </section>

      <section className="card">
        <h2 className="section-title">Відключення сьогодні</h2>
        {intervals.length === 0 ? (
          <p>Сьогодні відключень не заплановано</p>
        ) : (
          <ul className="intervals">
            {intervals.map((i) => {
              const isCurrent = nowMinutes >= i.start && nowMinutes < i.end;
              return (
                <li
                  key={i.start}
                  className={`interval ${isCurrent ? "interval--current" : ""}`}
                >
                  <span>
                    {formatMinutes(i.start)}–{formatMinutes(i.end)}
                  </span>
                  {isCurrent && <span className="badge">зараз</span>}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="updated">Оновлено: {updated.toLocaleString("uk-UA")}</p>
    </main>
  );
}

export default App;