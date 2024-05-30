import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Messages = ({ user }) => {
  const [threads, setThreads] = useState({});
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [newMessage, setNewMessage] = useState({ recipient: '', content: '' });
  const [replyContent, setReplyContent] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);

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

    const threadId = `${user.id}-${newMessage.recipient}`;
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
        setNewMessage({ recipient: '', content: '' });
        setCurrentThreadId(threadId);
        setShowMessageForm(false);
      })
      .catch(err => console.error('Error sending message:', err));
  };

  const handleThreadClick = (threadId) => {
    setCurrentThreadId(threadId);
  };

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleReplySubmit = (e, threadId) => {
    e.preventDefault();
    if (!user || !user.id || !replyContent.trim()) {
      console.error('User is not defined or reply content is empty');
      return;
    }

    const lastMessage = threads[threadId][threads[threadId].length - 1];
    const messageData = {
      recipient: lastMessage.sender._id === user.id ? lastMessage.recipient._id : lastMessage.sender._id,
      content: replyContent,
      sender: user.id,
      threadId
    };

    axios.post('http://localhost:8000/messages', messageData)
      .then(res => {
        setThreads(prevThreads => {
          const updatedThreads = { ...prevThreads };
          updatedThreads[threadId].push(res.data);
          return updatedThreads;
        });
        setReplyContent('');
      })
      .catch(err => console.error('Error sending reply:', err));
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
      <button className='reply-id' onClick={() => setShowMessageForm(true)}>Message by Recipient ID</button>
      {showMessageForm && (
        <form className="message-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipient ID:</label>
            <input
              type="text"
              name="recipient"
              value={newMessage.recipient}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Message:</label>
            <textarea
              name="content"
              value={newMessage.content}
              onChange={handleChange}
            />
          </div>
          <button className='send-id' type="submit">Send</button>
          <button className='cancel-id' type="button" onClick={() => setShowMessageForm(false)}>Cancel</button>
        </form>
      )}
      {!showMessageForm && (
        <>
          <h2>Messages</h2>
          <div className="threads-list">
            {sortedThreadIds.map(threadId => (
              <div key={threadId} className="thread-item" onClick={() => handleThreadClick(threadId)}>
                <p>Conversation with {getOtherPersonName(threads[threadId])}</p>
                <p className="last-message-date">Last message: {getLastMessageDate(threads[threadId])}</p>
              </div>
            ))}
          </div>
          {currentThreadId && (
            <div className='thread-reply'>
              <div className="current-thread">
                {threads[currentThreadId].slice().reverse().map(msg => (
                  <div key={msg._id} className="message-item">
                    <p><strong>{msg.sender.name}:</strong> {msg.content}</p>
                    <p className="message-date">{new Date(msg.date).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <form className="thread-reply-form" onSubmit={(e) => handleReplySubmit(e, currentThreadId)}>
                <textarea
                  name="replyContent"
                  value={replyContent}
                  onChange={handleReplyChange}
                  placeholder="Type your reply here..."
                />
                <button type="submit">Send Reply</button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Messages;
