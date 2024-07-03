import React, { useState, useEffect } from "react";

function SearchBox({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); // Add selectedIndex state

  useEffect(() => {
    const handleFetchSuggestions = async () => {
      const fetchedSuggestions = await fetchSuggestions(query);
      setSuggestions(fetchedSuggestions);
      setShowSuggestions(true);
      setSelectedIndex(-1); // Reset selectedIndex when new suggestions are fetched
    };

    if (query.length > 1) {
      const timerId = setTimeout(handleFetchSuggestions, 200);
      return () => clearTimeout(timerId);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSuggestions) return;
      if (e.key === "ArrowDown") {
        e.preventDefault(); // Prevent the page from scrolling
        setSelectedIndex(
          (prevIndex) => (prevIndex + 1) % (suggestions?.length || 0)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault(); // Prevent the page from scrolling
        setSelectedIndex(
          (prevIndex) =>
            (prevIndex - 1 + (suggestions?.length || 0)) %
            (suggestions?.length || 0)
        );
      } else if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission
        if (selectedIndex >= 0) {
          setQuery(suggestions[selectedIndex]);
          setShowSuggestions(false);
        }
      } else if (e.key === " ") {
        console.log("space");
        if (selectedIndex >= 0) {
          setQuery(suggestions[selectedIndex]);
          setShowSuggestions(false);
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showSuggestions, suggestions, selectedIndex]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search..."
          style={{
            padding: "10px",
            borderRadius: "5px",
            width: "300px",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "5px",
            fontSize: "16px",
            marginLeft: "10px",
          }}
        >
          Search
        </button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute", // This makes the list float over content below
            top: "calc(100% - 25px)", // Positions the list right below the search box
            width: "300px",
            backgroundColor: "#282c34",
            padding: "10px",
            borderRadius: "5px",
            justifyContent: "center",
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                cursor: "pointer",
                padding: "5px",
                borderRadius: "5px",
                marginBottom: "0px",
                backgroundColor:
                  index === selectedIndex ? "#a0a0a0" : "transparent",
                listStyleType: "none",
                textAlign: "left",
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

async function fetchSuggestions(query) {
  const response = await fetch(
    `http://127.0.0.1:8000/suggestions?query=${encodeURIComponent(query)}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const suggestions = await response.json();
  if (suggestions.length === 0) {
    return [];
  }
  return suggestions;
}

export default SearchBox;
