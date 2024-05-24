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
          <label>Recipient ID:</### Finalizing the Core Features Implementation

Here's the complete setup for the Messaging System, including both the backend routes and the frontend component. 

### Messaging System

#### Backend

**Message Model (`models/message.js`):**

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
