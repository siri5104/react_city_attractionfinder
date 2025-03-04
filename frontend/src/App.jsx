import { useState } from "react";
import "./App.css";


function App() {
  const [city, setCity] = useState("");
  const [intro, setIntro] = useState("");
  const [attractions, setAttractions] = useState([]);

  const getAttractions = async () => {
    if (!city.trim()) {
      alert("Please enter a city name");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/cities/${city.trim()}/attractions`);
      const data = await response.json();

      if (!data || !data.attractions || !Array.isArray(data.attractions)) {
        throw new Error("Invalid response format");
      }

      if (data.attractions.length === 0) {
        setIntro("No attractions found.");
        setAttractions([]);
        return;
      }

      setIntro(`Top attractions in ${city}:`);
      setAttractions(data.attractions);
    } catch (error) {
      console.error("Error fetching attractions:", error);
      alert("Failed to fetch attractions");
    }
  };

  return (
    <div className="App">
      <h1>🔍City Attractions Finder</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getAttractions}>🔍Get Attractions</button>
      </div>
      <div id="output">
        {intro && <p>{intro}</p>}

        {attractions.length > 0 ? (
          <ol>
            {attractions.map((attraction, index) => (
              <li key={index}>
                <strong>{attraction.name}</strong>: {attraction.description}
              </li>
            ))}
          </ol>
        ) : (
          <p>No attractions found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
