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

  if (loading && !data) return <p>Завантаження...</p>;
  if (!data) return <p>Помилка: {error ?? "даних немає"}</p>;

  const day = Object.values(data.fact.data)[0];
  if (!day) return <p>На сьогодні даних ще немає</p>;

  const groups = Object.keys(day);
  const group =
    selectedGroup && groups.includes(selectedGroup) ? selectedGroup : groups[0];

  const intervals = toOutageIntervals(day[group]);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const status = getPowerStatus(intervals, nowMinutes);

  const updated = new Date(data.lastUpdated);
  const isOldDay = updated.toDateString() !== now.toDateString();

  return (
    <div>
      <h1>Графік відключень</h1>

      {fromCache && error && (
        <p>
          ⚠️ Немає звʼязку з джерелом. Показано збережені дані.
          {isOldDay && " Вони можуть бути застарілими: оновлення було не сьогодні."}
        </p>
      )}

      <GroupSelect groups={groups} value={group} onChange={handleGroupChange} />

      <p>
        {status.isOff
          ? `Світла немає. Увімкнуть о ${formatMinutes(status.until)} (через ${formatDuration(status.until - nowMinutes)})`
          : status.next !== null
            ? `Світло є. Наступне відключення о ${formatMinutes(status.next)} (через ${formatDuration(status.next - nowMinutes)})`
            : "Світло є. Більше відключень сьогодні не заплановано"}
      </p>

      {intervals.length === 0 ? (
        <p>Сьогодні відключень не заплановано</p>
      ) : (
        <ul>
          {intervals.map((i) => {
            const isCurrent = nowMinutes >= i.start && nowMinutes < i.end;
            return (
              <li
                key={i.start}
                style={{ fontWeight: isCurrent ? "bold" : "normal" }}
              >
                {formatMinutes(i.start)}–{formatMinutes(i.end)}
                {isCurrent && " ← зараз"}
              </li>
            );
          })}
        </ul>
      )}

      <p>Оновлено: {updated.toLocaleString("uk-UA")}</p>
    </div>
  );
}

export default App;