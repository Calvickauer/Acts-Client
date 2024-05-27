import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Messages = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ recipient: '', content: '' });

  useEffect(() => {
    console.log('User in useEffect:', user); // Debugging log
    if (user && user.id) {
      axios.get(`http://localhost:8000/messages/${user.id}`)
        .then(res => setMessages(res.data))
        .catch(err => console.log(err));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMessage(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      console.error('User is not defined');
      return;
    }

    axios.post('http://localhost:8000/messages', { ...newMessage, sender: user.id })
      .then(res => {
        setMessages([...messages, res.data]);
        setNewMessage({ recipient: '', content: '' }); // Clear the form
      })
      .catch(err => {
        console.error('Error sending message:', err);
      });
  };

  return (
    <div>
      <h2>Messages</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipient ID:</label>
          <input type="text" name="recipient" value={newMessage.recipient} onChange={handleChange} />
        </div>
        <div>
          <label>Message:</label>
          <textarea name="content" value={newMessage.content} onChange={handleChange} />
        </div>
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map(msg => (
          <li key={msg._id}>
            <p><strong>From:</strong> {msg.sender.name} ({msg.sender.email})</p>
            <p><strong>To:</strong> {msg.recipient.name} ({msg.recipient.email})</p>
            <p><strong>Message:</strong> {msg.content}</p>
            <p><strong>Date:</strong> {new Date(msg.date).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;
