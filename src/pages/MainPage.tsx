import axios from "axios";
import { useState } from "react";
import "./MainPage.css";

export function MainPage() {
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [packages, setPackages] = useState<any[]>([]);

  const getNpmPackages = async (queryString: string) => {
    setLoading(true);
    const { data } = await axios.get(
      `https://api.npms.io/v2/search/suggestions?q=${queryString}`,
    );
    setPackages(data);
    setLoading(false);
  };

  const hasResults = packages.length > 0 && !!searchString;

  return (
    <div className="page">
      <div className="search-toolbar">
        <input
          type="text"
          value={searchString}
          onChange={(event) => setSearchString(event.target.value)}
          onKeyUp={async (event) => {
            if (event.key === "Enter") {
              await getNpmPackages(searchString);
            }
          }}
        />
        <button onClick={() => getNpmPackages(searchString)}>Search</button>
      </div>

      {loading && <span>Loading...</span>}
      {packages.length > 0 && (
        <div className="results">
          <span>Found {packages.length} packages!</span>
        </div>
      )}
    </div>
  );
}
