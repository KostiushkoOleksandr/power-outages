import { useState } from "react";
import { useOutages } from "./hooks/useOutages";
import { toOutageRanges } from "./utils/schedule";

function App() {
  const { data, loading, error } = useOutages();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (!data) return <p>Даних немає</p>;

  const day = Object.values(data.fact.data)[0];
  if (!day) return <p>На сьогодні даних ще немає</p>;

  const groups = Object.keys(day);
  const group = selectedGroup ?? groups[0];
  const hours = day[group];
  const ranges = hours ? toOutageRanges(hours) : [];

  return (
    <div>
      <h1>Графік відключень</h1>

      <label>
        Група:{" "}
        <select
          value={group}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      {ranges.length === 0 ? (
        <p>Сьогодні відключень не заплановано</p>
      ) : (
        <ul>
          {ranges.map((range) => (
            <li key={range}>{range}</li>
          ))}
        </ul>
      )}

      <p>Оновлено: {new Date(data.lastUpdated).toLocaleString("uk-UA")}</p>
    </div>
  );
}

export default App;