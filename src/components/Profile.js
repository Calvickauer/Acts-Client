import React, { useState, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

const Profile = () => {
  const [profile, setProfile] = useState({ bio: '', profilePicture: '' });

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setAuthToken(token);
      axios.get('/users/profile')
        .then(res => setProfile(res.data))
        .catch(err => console.log(err));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/users/profile', profile)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Bio:</label>
          <textarea name="bio" value={profile.bio} onChange={handleChange} />
        </div>
        <div>
          <label>Profile Picture URL:</label>
          <input type="text" name="profilePicture" value={profile.profilePicture} onChange={handleChange} />
        </div>
        <button type="submit">Save</button>
      </form>
      {profile.profilePicture && <img src={profile.profilePicture} alt="Profile" />}
    </div>
  );
};

export default Profile;
