import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Retreats = ({ user }) => {
  const [retreats, setRetreats] = useState([]);
  const [filteredRetreats, setFilteredRetreats] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    console.log("Retreats component mounted with user:", user); // Log user on component mount

    const fetchRetreats = async () => {
      try {
        console.log("Calling scrape endpoint");
        await axios.post('http://localhost:8000/retreats/scrape');
        console.log("Scrape completed, fetching retreats");
        const response = await axios.get('http://localhost:8000/retreats');
        setRetreats(response.data);
        setFilteredRetreats(response.data);
        console.log("Retreats fetched:", response.data);
      } catch (error) {
        console.error("Error fetching retreats:", error);
      }
    };

    fetchRetreats();
  }, [user]);

  useEffect(() => {
    let filtered = retreats;

    if (selectedState) {
      filtered = filtered.filter(retreat => retreat.location.includes(selectedState));
    }

    if (selectedCity) {
      filtered = filtered.filter(retreat => retreat.location.includes(selectedCity));
    }

    setFilteredRetreats(filtered);
  }, [selectedState, selectedCity, retreats]);

  const states = Array.from(new Set(retreats.map(retreat => retreat.location.split(', ')[1]))).sort();

  const citiesByState = {};
  retreats.forEach(retreat => {
    const [city, state] = retreat.location.split(', ');
    if (!citiesByState[state]) {
      citiesByState[state] = new Set();
    }
    citiesByState[state].add(city);
  });

  const addToProfile = async (retreatId) => {
    try {
      console.log("Adding retreat to profile", { userId: user.id, retreatId });
      const response = await axios.post('http://localhost:8000/retreats/add-to-profile', { userId: user.id, retreatId });
      console.log("Retreat added to profile:", response.data);
    } catch (error) {
      console.error("Error adding retreat to profile:", error);
    }
  };

  return (
    <div className="retreats-container">
      <h1>Retreats</h1>
      <div className="state-buttons">
        {states.map((state, index) => (
          <div key={index} className="dropdown">
            <button
              onClick={() => setSelectedState(state)}
              className={state === selectedState ? 'active' : ''}
            >
              {state}
            </button>
            <div className="dropdown-content">
              {[...citiesByState[state]].sort().map((city, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedCity(city);
                    setSelectedState(state);
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button onClick={() => {
          setSelectedState('');
          setSelectedCity('');
        }}>
          All
        </button>
      </div>
      <div className="retreats-grid">
        {filteredRetreats.length > 0 ? (
          filteredRetreats.map((retreat, index) => (
            <div key={index} className="retreat-card">
              <div className="retreat-title">{retreat.title}</div>
              <div className="retreat-date">Start Date: {retreat.date}</div>
              <div className="retreat-location">Location: {retreat.location}</div>
              <div className="retreat-type">{retreat.retreatType}</div>
              <div className="retreat-language">{retreat.language}</div>
              <button onClick={() => addToProfile(retreat._id)}>Add to Profile</button>
            </div>
          ))
        ) : (
          <p>Loading retreats...</p>
        )}
      </div>
    </div>
  );
};

export default Retreats;
