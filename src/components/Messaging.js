import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Messaging = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ recipient: '', content: '' });

  useEffect(() => {
    if (user) {
      axios.get(`/messages/${user._id}`)
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
    axios.post('/messages', { ...newMessage, sender: user._id })
      .then(res => setMessages([...messages, res.data]))
      .catch(err => console.log(err));
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

export default Messaging;
