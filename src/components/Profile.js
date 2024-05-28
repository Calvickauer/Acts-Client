import React, { useState, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

const Profile = () => {
  const [profile, setProfile] = useState({ bio: '', profilePicture: '', email: '', _id: '', retreats: [] });
  const [showPictureForm, setShowPictureForm] = useState(false);
  const [showBioForm, setShowBioForm] = useState(false);
  console.log("retreats linked to profile:", profile.retreats);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setAuthToken(token);
      axios.get('http://localhost:8000/users/profile')
        .then(res => {
          console.log('Profile data fetched:', res.data); // Log the fetched profile data
          const userProfile = res.data.profile ? { ...res.data.profile, email: res.data.email, _id: res.data._id, retreats: res.data.retreats } : { email: res.data.email, _id: res.data._id, retreats: res.data.retreats };
          setProfile(userProfile);
        })
        .catch(err => console.log(err));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/users/profile', { bio: profile.bio, profilePicture: profile.profilePicture })
      .then(res => {
        const userProfile = res.data.profile ? { ...res.data.profile, email: res.data.email, _id: res.data._id, retreats: res.data.retreats } : { email: res.data.email, _id: res.data._id, retreats: res.data.retreats };
        setProfile(userProfile);
        setShowPictureForm(false);
        setShowBioForm(false);
      })
      .catch(err => console.log(err));
  };

  const togglePictureForm = () => {
    setShowPictureForm(prevState => !prevState);
  };

  const toggleBioForm = () => {
    setShowBioForm(prevState => !prevState);
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {profile.profilePicture ? (
        <div className="profile-picture-section">
          <img src={profile.profilePicture} alt="Profile" className="profile-picture" />
          <button onClick={togglePictureForm} className="toggle-button">
            {showPictureForm ? 'Hide' : 'Change Profile Picture'}
          </button>
        </div>
      ) : (
        <div className="profile-picture-section">
          <button onClick={togglePictureForm} className="toggle-button">
            Add Profile Picture
          </button>
        </div>
      )}

      {showPictureForm && (
        <form onSubmit={handleSubmit} className="profile-form">
          <div>
            <label>Profile Picture URL:</label>
            <input type="text" name="profilePicture" value={profile.profilePicture} onChange={handleChange} />
          </div>
          <button type="submit">Save</button>
        </form>
      )}

      <div className="profile-details">
        <h3>Email: {profile.email}</h3>
        <h3>User ID: {profile._id}</h3>
        <div className="bio-section">
          <h3>Bio:</h3>
          <p>{profile.bio}</p>
          {profile.bio ? (
            <button onClick={toggleBioForm} className="toggle-button">
              {showBioForm ? 'Hide' : 'Change Bio'}
            </button>
          ) : (
            <button onClick={toggleBioForm} className="toggle-button">
              Add Bio
            </button>
          )}
        </div>
      </div>

      {showBioForm && (
        <form onSubmit={handleSubmit} className="profile-form">
          <div>
            <label>Bio:</label>
            <textarea name="bio" value={profile.bio} onChange={handleChange} />
          </div>
          <button type="submit">Save</button>
        </form>
      )}

      <div className="retreats-section">
        <h3>Added Retreats:</h3>
        {profile.retreats.length > 0 ? (
          <ul>
            {profile.retreats.map(retreat => (
              <li key={retreat._id}>
                <h4>{retreat.title}</h4>
                <p>{retreat.location}</p>
                <p>{retreat.date}</p>
                <p>{retreat.retreatType}</p>
                <p>{retreat.language}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No retreats added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
