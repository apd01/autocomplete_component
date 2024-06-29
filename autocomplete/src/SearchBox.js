import React, { useState, useEffect } from "react";

function SearchBox({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleFetchSuggestions = async () => {
      const fetchedSuggestions = await fetchSuggestions(query);
      setSuggestions(fetchedSuggestions);
      setShowSuggestions(true);
    };

    if (query.length > 1) {
      // Only fetch suggestions if query length is more than 1
      const timerId = setTimeout(handleFetchSuggestions, 200); // Debounce fetching
      return () => clearTimeout(timerId);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query);
    setShowSuggestions(false); // Hide suggestions on search
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
      {showSuggestions && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                cursor: "pointer",
                padding: "5px",
                borderRadius: "5px",
                marginBottom: "5px",
                backgroundColor: "#a2a2a2",
                listStyleType: "none",
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
  return suggestions;
}

export default SearchBox;
