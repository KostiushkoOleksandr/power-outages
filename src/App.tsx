import { useEffect } from "react";
import { fetchOutages } from "./api/outages";
import { toOutageRanges } from "./utils/schedule";

function App() {
  useEffect(() => {
    fetchOutages().then((data) => {
      const day = Object.values(data.fact.data)[0];
      console.log(toOutageRanges(day["GPV1.1"]));
    });
  }, []);

  return <h1>Графік відключень</h1>;
}

export default App;