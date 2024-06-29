import React from "react";
import "./App.css";
import SearchBox from "./SearchBox";

function App() {
  const handleSearch = (query) => {
    console.log(`Search for: ${query}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <SearchBox onSearch={handleSearch} />{" "}
      </header>
    </div>
  );
}

export default App;
