import { useState } from "react";
import { useOutages } from "../hooks/useOutages";
import { useNow } from "../hooks/useNow";
import {
  toOutageIntervals,
  getPowerStatus,
  formatMinutes,
  formatDuration,
  type PowerStatus,
} from "../utils/schedule";
import { groupLabel, sortGroups } from "../utils/groups";
import { SelectField } from "./SelectField";
import { EmergencyNotice } from "./EmergencyNotice";
import type { Region } from "../data/regions";

interface OutagesViewProps {
  region: Region;
}

function describeStatus(status: PowerStatus, nowMinutes: number) {
  if (status.isOff) {
    return {
      main: "Світла немає",
      sub: `Увімкнуть о ${formatMinutes(status.until)} (через ${formatDuration(status.until - nowMinutes)})`,
    };
  }
  if (status.next !== null) {
    return {
      main: "Світло є",
      sub: `Наступне відключення о ${formatMinutes(status.next)} (через ${formatDuration(status.next - nowMinutes)})`,
    };
  }
  return {
    main: "Світло є",
    sub: "Більше відключень сьогодні не заплановано",
  };
}

export function OutagesView({ region }: OutagesViewProps) {
  const { data, loading, error, fromCache } = useOutages(region);
  const now = useNow();

  const groupKey = `selectedGroup:${region.id}`;
  const [selectedGroup, setSelectedGroup] = useState<string | null>(() => {
    try {
      return localStorage.getItem(groupKey);
    } catch {
      return null;
    }
  });

  function handleGroupChange(group: string) {
    setSelectedGroup(group);
    try {
      localStorage.setItem(groupKey, group);
    } catch {
      // сховище недоступне, це не критично
    }
  }

  if (loading && !data) {
    return <p className="message">Завантаження...</p>;
  }
  if (!data) {
    return <p className="message">Помилка: {error ?? "даних немає"}</p>;
  }

  const dayKeys = Object.keys(data.fact?.data ?? {}).sort();
  if (dayKeys.length === 0) {
    return <p className="message">Для цієї області даних поки немає</p>;
  }

  // шукаємо розклад саме на сьогодні, інакше беремо останній відомий
  const todayKey = dayKeys.find(
    (k) => new Date(Number(k) * 1000).toDateString() === now.toDateString(),
  );
  const dayKey = todayKey ?? dayKeys[dayKeys.length - 1];
  const isToday = todayKey !== undefined;
  const dayDate = new Date(Number(dayKey) * 1000);
  const day = data.fact.data[dayKey];

  const groups = sortGroups(Object.keys(day));
  if (groups.length === 0) {
    return <p className="message">Для цієї області даних поки немає</p>;
  }
  const group =
    selectedGroup && groups.includes(selectedGroup) ? selectedGroup : groups[0];

  const intervals = toOutageIntervals(day[group]);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const status = getPowerStatus(intervals, nowMinutes);
  const { main, sub } = describeStatus(status, nowMinutes);

  const updated = new Date(data.lastUpdated);

  return (
    <>
      {fromCache && error && (
        <div className="warning">
          ⚠️ Немає звʼязку з джерелом. Показано збережені дані.
        </div>
      )}

      {!isToday && (
        <div className="warning">
          ⚠️ Актуального графіка на сьогодні для цієї області немає. Показано
          останні відомі дані за {dayDate.toLocaleDateString("uk-UA")}, вони
          можуть не відповідати дійсності.
        </div>
      )}

      <SelectField
        label="Черга"
        value={group}
        options={groups.map((g) => ({ value: g, label: groupLabel(g) }))}
        onChange={handleGroupChange}
      />

      {isToday && (
        <section
          className={`status ${status.isOff ? "status--off" : "status--on"}`}
        >
          <p className="status__label">За графіком</p>
          <p className="status__main">{main}</p>
          <p className="status__sub">{sub}</p>
        </section>
      )}

      <EmergencyNotice />

      <section className="card">
        <h2 className="section-title">
          {isToday
            ? "Відключення сьогодні"
            : `Графік за ${dayDate.toLocaleDateString("uk-UA")}`}
        </h2>
        {intervals.length === 0 ? (
          <p>Відключень не заплановано</p>
        ) : (
          <ul className="intervals">
            {intervals.map((i) => {
              const isCurrent =
                isToday && nowMinutes >= i.start && nowMinutes < i.end;
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
      <p className="disclaimer">
        Дані беруться з відкритого неофіційного джерела і можуть містити
        неточності. Свою чергу та актуальний графік перевіряйте на сайті
        вашого обленерго.
      </p>
    </>
  );
}