import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Messages = ({ user }) => {
  const [threads, setThreads] = useState({});
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [newMessage, setNewMessage] = useState({ recipient: '', content: '' });
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      axios.get(`http://localhost:8000/messages/${user.id}`)
        .then(res => setThreads(res.data))
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

    const threadId = replyTo ? replyTo.threadId : `${user.id}-${newMessage.recipient}`;
    const messageData = { ...newMessage, sender: user.id, threadId };

    axios.post('http://localhost:8000/messages', messageData)
      .then(res => {
        setThreads(prevThreads => {
          const updatedThreads = { ...prevThreads };
          if (!updatedThreads[threadId]) {
            updatedThreads[threadId] = [];
          }
          updatedThreads[threadId].push(res.data);
          return updatedThreads;
        });
        setNewMessage({ recipient: '', content: '' }); // Clear the form
        setReplyTo(null);
        setCurrentThreadId(threadId); // Set the current thread to the new or replied thread
      })
      .catch(err => console.error('Error sending message:', err));
  };

  const handleReply = (message) => {
    setReplyTo(message);
    setNewMessage({ ...newMessage, recipient: message.sender._id });
  };

  const handleThreadClick = (threadId) => {
    setCurrentThreadId(threadId);
  };

  const getOtherPersonName = (thread) => {
    if (!thread || !user) return '';
    const otherPerson = thread.find(msg => msg.sender._id !== user.id)?.sender || thread.find(msg => msg.recipient._id !== user.id)?.recipient;
    return otherPerson?.name || 'Unknown';
  };

  const getLastMessageDate = (thread) => {
    if (!thread || thread.length === 0) return '';
    return new Date(thread[thread.length - 1].date).toLocaleString();
  };

  const sortedThreadIds = Object.keys(threads).sort((a, b) => {
    const lastMessageA = threads[a][threads[a].length - 1];
    const lastMessageB = threads[b][threads[b].length - 1];
    return new Date(lastMessageB.date) - new Date(lastMessageA.date);
  });

  return (
    <div className="messages-container">
      <form className="message-form" onSubmit={handleSubmit}>
        {replyTo && (
          <div className="replying-to">
            <p><strong>Replying to:</strong> {replyTo.sender.name}</p>
            <p><strong>Message:</strong> {replyTo.content}</p>
          </div>
        )}
        <div className="form-group">
          <label>Recipient ID:</label>
          <input type="text" name="recipient" value={newMessage.recipient} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea name="content" value={newMessage.content} onChange={handleChange} />
        </div>
        <button type="submit">Send</button>
      </form>
      <h2>Messages</h2>
      <div className="threads-list">
        {sortedThreadIds.map(threadId => (
          <div key={threadId} className="thread-item" onClick={() => handleThreadClick(threadId)}>
            <p>Thread with {getOtherPersonName(threads[threadId])}</p>
            <p className="last-message-date">Last message: {getLastMessageDate(threads[threadId])}</p>
          </div>
        ))}
      </div>
      {currentThreadId && (
        <div className="current-thread">
          {threads[currentThreadId].slice().reverse().map(msg => (
            <div key={msg._id} className="message-item">
              <p><strong>{msg.sender.name}:</strong> {msg.content}</p>
              <p className="message-date">{new Date(msg.date).toLocaleString()}</p>
              <button className="reply-button" onClick={() => handleReply(msg)}>Reply</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
