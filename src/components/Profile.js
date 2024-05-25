import React, { useState, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';


const Profile = () => {
  const [profile, setProfile] = useState({ bio: '', profilePicture: '', email: '', _id: '' });
  const [showPictureForm, setShowPictureForm] = useState(false);
  const [showBioForm, setShowBioForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setAuthToken(token);
      axios.get('http://localhost:8000/users/profile')
        .then(res => {
          const userProfile = res.data.profile ? { ...res.data.profile, email: res.data.email, _id: res.data._id } : { email: res.data.email, _id: res.data._id };
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
        const userProfile = res.data.profile ? { ...res.data.profile, email: res.data.email, _id: res.data._id } : { email: res.data.email, _id: res.data._id };
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
    </div>
  );
};

export default Profile;
