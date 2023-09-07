
//import React, { BrowserRouter, Route, Routes, useState, useEffect } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../App.css';

const Home = () => {
    const [csvData, setCsvData] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredData, setFilteredData] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null); // Define error state
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
    
      if (file) {
        if (file.type === 'text/csv') {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target) {
              const contents = e.target.result as string;
              setCsvData(contents);
              setError(null); // Clear any previous errors
            }
          };
          reader.onerror = (e) => {
          setError('An error occurred while reading the file.'); // Set error message
        };
        reader.readAsText(file);
      } else {
        setError('Please select a valid CSV file.'); // Set error message for incorrect file type
      }
    }
  };
      
  useEffect(() => {
    if (csvData) {
      // Split CSV data into lines
      const lines = csvData.split('\n');
      // Filter lines based on the search term
      const filteredLines = lines.filter((line) =>
        line.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filteredLines);
    }
  }, [csvData, searchTerm]);

  return (
    <div className="container">
      <header>
        <h1>React Project</h1>
      </header>

      <section className="main-content">
        <div className="upload-section">
          <h2>Upload CSV File</h2>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="search-section">
          <h2>Search for Data</h2>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {filteredData.length > 0 && (
        <section className="card-section">
          <h2>Matching Cards</h2>
          <div className="card-container">
            {filteredData.map((line, index) => (
              <div className="card" key={index}>
                {line.split(',').map((data, dataIdx) => (
                  <div className="card-data" key={dataIdx}>
                    {data}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
