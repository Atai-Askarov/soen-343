import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import './css/Chatbox.css';

// Connect to Flask-SocketIO backend
const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const Chatbox = () => {
  const { eventId } = useParams(); // Get eventId from URL params
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Store user info from localStorage
  const hasJoinedRef = useRef(false); // Track if the client has joined the room
  const userRef = useRef(null); // Store user data for cleanup
  const [isChatVisible, setChatVisible] = useState(false);

  const toggleChat = () => {
    setChatVisible(!isChatVisible);
  };


  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log('Stored user from localStorage:', storedUser); // Debug log
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed user:', JSON.stringify(parsedUser, null, 2)); // Debug log
        if (parsedUser && parsedUser.id && parsedUser.username) {
          setIsLoggedIn(true);
          setUser(parsedUser);
          userRef.current = parsedUser; // Store in ref
        } else {
          console.error('Invalid user data in localStorage:', parsedUser);
          localStorage.removeItem('user'); // Clear invalid data
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
  }, []);

  // Set up SocketIO event listeners (only once)
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('receiveMessage', ({ user, message }) => {
      setMessages((prevMessages) => [...prevMessages, { user, message }]);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('receiveMessage');
    };
  }, []); // Empty dependency array to run only once

  // Handle joining and leaving the room
  useEffect(() => {
    if (!user || !user.id || !user.username || !eventId) {
      console.log('Skipping room join due to missing data:', { user, eventId });
      return;
    }

    // Join the room if not already joined
    if (!hasJoinedRef.current) {
      console.log('Emitting join event with user:', user); // Debug log
      socket.emit('join', { room: eventId, userId: user.id, username: user.username });
      hasJoinedRef.current = true;
    }

    return () => {
      if (hasJoinedRef.current) {
        console.log('Emitting leave event with userRef:', userRef.current); // Debug log
        if (userRef.current && userRef.current.id && userRef.current.username && eventId) {
          socket.emit('leave', { room: eventId, userId: userRef.current.id, username: userRef.current.username });
        } else {
          console.error('Cannot emit leave event during cleanup due to missing data:', { user: userRef.current, eventId });
        }
        hasJoinedRef.current = false;
      }
    };
  }, [isLoggedIn, user, eventId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (text.trim() && user && user.id && user.username && eventId) {
      console.log('Emitting sendMessage event with user:', user); // Debug log
      socket.emit('sendMessage', { room: eventId, message: text, userId: user.id, username: user.username });
      setText('');
    } else {
      console.error('Cannot send message due to missing data:', { user, eventId });
    }
  };

  if (!isLoggedIn) {
    return (
      <div>
        <p>Please login first before chatting!</p>
      </div>
    );
  }

  return (
    <div>
    {/* Floating Button */} 
    <button className="floating-btn" onClick={toggleChat}>
      <i className="fa fa-comments"></i> {/* Icon for the button */}
    </button>

    {/* Chatbox Container */}
    {isChatVisible && (
      <div className="chatbox-container">
        <div className="chat-window">
        <div>
          <p>Logged in as: {user?.username || 'Unknown'}</p>
        </div>
          {messages.map((msg, index) => (
            <div className="chat-messages" key={index}>
              <strong>{msg.user}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <form className="form-chat" onSubmit={handleSendMessage}>
          <div className="input-container">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message here..."
            />
            <button className="send" type="submit">
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    )}
  </div>
  );
};

export default Chatbox;