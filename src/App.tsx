import { useOutages } from "./hooks/useOutages";
import { toOutageRanges } from "./utils/schedule";

const GROUP = "GPV1.1";

function App() {
  const { data, loading, error } = useOutages();

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (!data) return <p>Даних немає</p>;

  const day = Object.values(data.fact.data)[0];
  const hours = day?.[GROUP];

  if (!hours) return <p>Для групи {GROUP} даних немає</p>;

  const ranges = toOutageRanges(hours);

  return (
    <div>
      <h1>Графік відключень</h1>
      <h2>Група {GROUP}</h2>

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