import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Retreats = () => {
  const [retreats, setRetreats] = useState([]);

  useEffect(() => {
    const fetchRetreats = async () => {
      try {
        console.log("Calling scrape endpoint");
        await axios.post('http://localhost:8000/retreats/scrape'); // Ensure this matches your server URL and port
        console.log("Scrape completed, fetching retreats");
        const response = await axios.get('http://localhost:8000/retreats');
        setRetreats(response.data);
        console.log("Retreats fetched:", response.data);
      } catch (error) {
        console.error("Error fetching retreats:", error);
      }
    };

    fetchRetreats();
  }, []);

  return (
    <div>
      <h1>Retreats</h1>
      {retreats.length > 0 ? (
        retreats.map((retreat, index) => (
          <div key={index} className="retreat-card">
            <div className="retreat-title">{retreat.title}</div>
            <div className="retreat-date">{retreat.date}</div>
            <div className="retreat-location">{retreat.location}</div>
            <div className="retreat-type">{retreat.retreatType}</div>
            <div className="retreat-language">{retreat.language}</div>
          </div>
        ))
      ) : (
        <p>No retreats available</p>
      )}
    </div>
  );
};

export default Retreats;
