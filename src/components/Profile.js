import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

const Profile = ({ user }) => {
  const [profile, setProfile] = useState({ bio: '', profilePicture: '', email: '', _id: '', retreats: [] });
  const [showPictureForm, setShowPictureForm] = useState(false);
  const [showBioForm, setShowBioForm] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [pictureInput, setPictureInput] = useState('');
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (user) {
      setAuthToken(localStorage.getItem('jwtToken'));
      try {
        console.log('Fetching profile for user:', user.id);
        const res = await axios.get(`http://localhost:8000/users/profile`);
        const userProfile = {
          email: res.data.email,
          _id: res.data._id,
          profilePicture: res.data.profile?.profilePicture,
          bio: res.data.profile?.bio,
          retreats: res.data.retreats
        };
        setProfile(userProfile);
        setBioInput(userProfile.bio);
        setPictureInput(userProfile.profilePicture);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch profile data');
      }
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleBioChange = (e) => {
    setBioInput(e.target.value);
    console.log('Bio input updated:', e.target.value);
  };

  const handlePictureChange = (e) => {
    setPictureInput(e.target.value);
    console.log('Picture input updated:', e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/users/profile', { bio: bioInput, profilePicture: pictureInput });
      await fetchProfile(); // Fetch profile again to update the state with retreats
      setShowPictureForm(false);
      setShowBioForm(false);
      console.log('Profile updated successfully:', res.data);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const togglePictureForm = () => {
    setShowPictureForm(prevState => !prevState);
    console.log('Toggled picture form:', !showPictureForm);
  };

  const toggleBioForm = () => {
    setShowBioForm(prevState => !prevState);
    console.log('Toggled bio form:', !showBioForm);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

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
            <input type="text" name="profilePicture" value={pictureInput} onChange={handlePictureChange} />
          </div>
          <button type="submit">Save</button>
        </form>
      )}

      <div className="profile-details">
        <h4>Email: {profile.email}</h4>
        <h5>User ID: {profile._id}</h5>
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
            <textarea name="bio" value={bioInput} onChange={handleBioChange} />
          </div>
          <button type="submit">Save</button>
        </form>
      )}

      <div className="retreats-section">
        <h3>Your Retreats:</h3>
        {profile.retreats.length > 0 ? (
          <ul className='profile-retreats'>
            {profile.retreats.map(retreat => (
              <li key={retreat._id}>
                <h5>{retreat.title}</h5>
                <p>{retreat.location}</p>
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
