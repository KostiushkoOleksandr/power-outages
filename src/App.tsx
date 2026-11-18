import { useState } from "react";
import { useOutages } from "./hooks/useOutages";
import { toOutageRanges } from "./utils/schedule";
import { GroupSelect } from "./components/GroupSelect";

const STORAGE_KEY = "selectedGroup";

function App() {
  const { data, loading, error } = useOutages();
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

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (!data) return <p>Даних немає</p>;

  const day = Object.values(data.fact.data)[0];
  if (!day) return <p>На сьогодні даних ще немає</p>;

  const groups = Object.keys(day);
  const group =
    selectedGroup && groups.includes(selectedGroup) ? selectedGroup : groups[0];
  const ranges = toOutageRanges(day[group]);

  return (
    <div>
      <h1>Графік відключень</h1>
      <GroupSelect groups={groups} value={group} onChange={handleGroupChange} />

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