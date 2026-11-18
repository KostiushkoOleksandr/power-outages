import { useEffect, useState } from "react";
import { OutagesView } from "./components/OutagesView";
import { SelectField } from "./components/SelectField";
import { ThemeToggle } from "./components/ThemeToggle";
import { REGIONS, findRegion, regionTitle } from "./data/regions";

const REGION_KEY = "selectedRegion";

function App() {
  const [regionId, setRegionId] = useState<string>(() => {
    try {
      return findRegion(localStorage.getItem(REGION_KEY)).id;
    } catch {
      return findRegion(null).id;
    }
  });

  const region = findRegion(regionId);

  useEffect(() => {
    document.title = `Графік відключень: ${regionTitle(region)}`;
  }, [region]);

  function handleRegionChange(id: string) {
    setRegionId(id);
    try {
      localStorage.setItem(REGION_KEY, id);
    } catch {
      // сховище недоступне, це не критично
    }
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <h1 className="title">Графік відключень</h1>
          <p className="region-name">{regionTitle(region)}</p>
        </div>
        <ThemeToggle />
      </header>

      <SelectField
        label="Область"
        value={region.id}
        options={REGIONS.map((r) => ({ value: r.id, label: regionTitle(r) }))}
        onChange={handleRegionChange}
      />

      {/* key змушує React створити компонент заново при зміні області,
          тому стан і кеш не змішуються між областями */}
      <OutagesView key={region.id} region={region} />
    </main>
  );
}

export default App;