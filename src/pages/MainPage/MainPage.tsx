import axios from "axios";
import { useState } from "react";
import "./MainPage.css";
import { Package } from "./types";

export function MainPage() {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);

  const getNpmPackages = async (queryString: string) => {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `https://api.npms.io/v2/search/suggestions?q=${queryString}`,
      );
      setPackages(data);
    } catch {
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

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

      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          {showError && (
            <span>Oh no! Something went wrong... please try again.</span>
          )}

          {packages.length > 0 && (
            <div className="results">
              {packages.map((pkg) => (
                <div className="result-item" key={pkg.package.name}>
                  <strong>
                    <a href={pkg.package.links.npm}>{pkg.package.name}</a>
                  </strong>
                  <span>{pkg.package.description}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
