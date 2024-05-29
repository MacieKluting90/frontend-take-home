import axios from "axios";
import { useState } from "react";
import "./MainPage.css";
import { Package } from "./types";

export function MainPage() {
  const [loading, setLoading] = useState(false);
  const [forceError, setForceError] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);

  const getNpmPackages = async (queryString: string) => {
    setLoading(true);
    setShowErrorMessage(false);

    try {
      const { data } = await axios.get(
        `https://api.npms.io/v2/search/suggestions?q=${queryString}`,
      );

      if (forceError) {
        throw new Error();
      } else {
        setPackages(data);
      }
    } catch {
      setShowErrorMessage(true);
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
        <div className="error-toggle">
          <input
            type="checkbox"
            id="forceError"
            name="forceError"
            value="forceError"
            checked={forceError}
            onChange={(event) => setForceError(event.target.checked)}
          />
          <label className="error-toggle-label" htmlFor="forceError">
            Test Error State
          </label>
        </div>
      </div>

      {loading ? (
        <span>Loading...</span>
      ) : (
        <div className="results">
          {showErrorMessage ? (
            <span>Oh no! Something went wrong... please try again.</span>
          ) : (
            packages.length > 0 && (
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
            )
          )}
        </div>
      )}
    </div>
  );
}
