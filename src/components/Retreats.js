import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Retreat = () => {
  const [retreats, setRetreats] = useState([]);
  const [newRetreat, setNewRetreat] = useState({ name: '', date: '', location: '', description: '' });

  useEffect(() => {
    axios.get('/retreats')
      .then(res => setRetreats(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRetreat(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/retreats', newRetreat)
      .then(res => setRetreats([...retreats, res.data]))
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Retreats</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={newRetreat.name} onChange={handleChange} />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" name="date" value={newRetreat.date} onChange={handleChange} />
        </div>
        <div>
          <label>Location:</label>
          <input type="text" name="location" value={newRetreat.location} onChange={handleChange} />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={newRetreat.description} onChange={handleChange} />
        </div>
        <button type="submit">Add Retreat</button>
      </form>
      <ul>
        {retreats.map(retreat => (
          <li key={retreat._id}>
            <h3>{retreat.name}</h3>
            <p>{new Date(retreat.date).toDateString()}</p>
            <p>{retreat.location}</p>
            <p>{retreat.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Retreat;
