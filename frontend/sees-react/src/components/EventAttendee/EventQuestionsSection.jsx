import React, { useState, useEffect } from 'react';
import { FaQuestion, FaUser, FaClock, FaReply } from 'react-icons/fa';
import '../css/eventQuestionsSection.css';

const EventQuestionsSection = ({ eventId }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/questions/${eventId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setQuestions(data.questions || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [eventId]);
  
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    
    if (!newQuestion.trim() || !user) return;
    
    try {
      const response = await fetch('http://localhost:5000/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: parseInt(eventId),
          user_id: user.id,
          username: user.username || user.email || "Anonymous User",
          question: newQuestion
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add the new question to the list
      setQuestions([...questions, data.question]);
      
      // Clear the form
      setNewQuestion('');
      
    } catch (error) {
      console.error("Error submitting question:", error);
      setError("Failed to submit your question. Please try again.");
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="event-questions-section">
      <h2>
        <FaQuestion className="section-icon" />
        Questions & Answers
      </h2>
      
      {/* Question form - visible to any logged in user */}
      {user && (
        <div className="question-form-container">
          <form onSubmit={handleQuestionSubmit}>
            <div className="question-input-group">
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask a question about this event..."
                rows="3"
                maxLength="500"
                required
              />
              <div className="question-form-footer">
                <small>{500 - newQuestion.length} characters remaining</small>
                <button type="submit" className="btn-primary">Submit Question</button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Login prompt if not logged in */}
      {!user && (
        <div className="login-prompt">
          <p>Please <a href="/login">log in</a> to ask questions about this event.</p>
        </div>
      )}
      
      {/* Questions display */}
      <div className="questions-container">
        <h3>Event Questions</h3>
        
        {loading && (
          <div className="loading-questions">
            <div className="spinner-small"></div>
            <p>Loading questions...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && questions.length === 0 && (
          <div className="no-questions">
            <p>No questions have been asked about this event yet.</p>
          </div>
        )}
        
        {!loading && questions.map(question => (
          <div key={question.id} className="question-card">
            <div className="question-header">
              <div className="question-user">
                <FaUser className="user-icon" />
                <span>{question.userName}</span>
              </div>
              <div className="question-timestamp">
                <FaClock className="time-icon" />
                <span>{formatDate(question.timestamp)}</span>
              </div>
            </div>
            
            <div className="question-content">
              <p>{question.question}</p>
            </div>
            
            {/* Answer section - displays actual answer or simple status message */}
            {question.answered ? (
              <div className="answer-container">
                <div className="answer-header">
                  <div className="answer-user">
                    <FaUser className="organizer-icon" />
                    <span>{question.answeredBy} (Organizer)</span>
                  </div>
                  <div className="answer-timestamp">
                    <FaClock className="time-icon" />
                    <span>{formatDate(question.answerTimestamp)}</span>
                  </div>
                </div>
                
                <div className="answer-content">
                  <p>{question.answer}</p>
                </div>
              </div>
            ) : (
              <div className="answer-placeholder">
                <div className="answer-placeholder-header">
                  <FaReply className="reply-icon" />
                  <span>This question hasn't been answered yet</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventQuestionsSection;