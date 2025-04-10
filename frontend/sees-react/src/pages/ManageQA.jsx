import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './css/manageQA.css';
import { FaCheckCircle, FaQuestionCircle, FaClock, FaUser, FaArrowLeft } from 'react-icons/fa';

const ManageQA = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [successMessage, setSuccessMessage] = useState({});
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'answered', 'unanswered'

  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await fetch(`http://127.0.0.1:5000/events/${eventId}`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event details');
        }
        const eventData = await eventResponse.json();
        setEvent(eventData);
      } catch (error) {
        setError("Error fetching event details: " + error.message);
        console.error("Error:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  // Fetch questions for this event
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/questions/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data.questions || []);
        
        // Initialize answer state for each question
        const initialAnswers = {};
        data.questions.forEach(q => {
          initialAnswers[q.id] = q.answer || '';
        });
        setAnswers(initialAnswers);
        
      } catch (error) {
        setError("Error fetching questions: " + error.message);
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [eventId]);

  // Handle answer input change
  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  // Submit answer for a question
  const handleSubmitAnswer = async (questionId) => {
    if (!user || !answers[questionId]?.trim()) return;
    
    setSubmitting({ ...submitting, [questionId]: true });
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/questions/answer/${questionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: answers[questionId],
          answered_by: user.id,
          answered_by_username: user.username || user.email
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }
      
      const result = await response.json();
      
      // Update questions list with the answered question
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, answered: true, answer: answers[questionId], answeredBy: user.username || user.email } : q
      ));
      
      setSuccessMessage({
        ...successMessage,
        [questionId]: 'Answer submitted successfully!'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage({
          ...successMessage,
          [questionId]: null
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting({...submitting, [questionId]: false});
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter questions based on active filter
  const filteredQuestions = questions.filter(q => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'answered') return q.answered;
    if (activeFilter === 'unanswered') return !q.answered;
    return true;
  });

  if (loading) {
    return (
      <div className="manage-qa-container">
        <div className="loading-spinner"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-qa-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <Link to={`/eventDashboard/${eventId}`} className="back-link">
            <FaArrowLeft /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-qa-container">
      <div className="qa-header">
        <Link to={`/eventDashboard/${eventId}`} className="back-link">
          <FaArrowLeft /> Back to Dashboard
        </Link>
        <h1>Q&A Management</h1>
        <h2>{event?.eventname}</h2>
      </div>

      <div className="qa-filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Questions ({questions.length})
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'unanswered' ? 'active' : ''}`}
          onClick={() => setActiveFilter('unanswered')}
        >
          Unanswered ({questions.filter(q => !q.answered).length})
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'answered' ? 'active' : ''}`}
          onClick={() => setActiveFilter('answered')}
        >
          Answered ({questions.filter(q => q.answered).length})
        </button>
      </div>

      <div className="questions-list">
        {filteredQuestions.length === 0 ? (
          <div className="no-questions">
            <FaQuestionCircle className="no-questions-icon" />
            <p>No {activeFilter !== 'all' ? activeFilter : ''} questions found for this event.</p>
          </div>
        ) : (
          filteredQuestions.map(question => (
            <div 
              key={question.id} 
              className={`question-card ${question.answered ? 'answered' : 'unanswered'}`}
            >
              <div className="question-header">
                <div className="question-meta">
                  <div className="question-user">
                    <FaUser className="icon" />
                    <span>{question.userName}</span>
                  </div>
                  <div className="question-time">
                    <FaClock className="icon" />
                    <span>{formatDate(question.timestamp)}</span>
                  </div>
                </div>
                <div className="question-status">
                  {question.answered ? (
                    <span className="status answered">
                      <FaCheckCircle /> Answered
                    </span>
                  ) : (
                    <span className="status unanswered">
                      <FaQuestionCircle /> Needs Answer
                    </span>
                  )}
                </div>
              </div>
              
              <div className="question-content">
                <p>{question.question}</p>
              </div>
              
              {question.answered ? (
                <div className="answer-box">
                  <div className="answer-header">
                    <strong>Your Answer:</strong>
                    <div className="answer-meta">
                      <span>By {question.answeredBy}</span>
                      <span className="dot">•</span>
                      <span>{question.answerTimestamp ? formatDate(question.answerTimestamp) : 'Recently'}</span>
                    </div>
                  </div>
                  <p>{question.answer}</p>
                  
                  <div className="answer-form">
                    <textarea
                      value={answers[question.id]}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Update your answer..."
                      rows="3"
                    />
                    <button 
                      onClick={() => handleSubmitAnswer(question.id)}
                      disabled={submitting[question.id] || !answers[question.id]?.trim()}
                      className="submit-answer"
                    >
                      {submitting[question.id] ? 'Updating...' : 'Update Answer'}
                    </button>
                    {successMessage[question.id] && (
                      <div className="success-message">{successMessage[question.id]}</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="answer-form">
                  <label>Your Answer:</label>
                  <textarea
                    value={answers[question.id]}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Write your answer here..."
                    rows="3"
                  />
                  <button 
                    onClick={() => handleSubmitAnswer(question.id)}
                    disabled={submitting[question.id] || !answers[question.id]?.trim()}
                    className="submit-answer"
                  >
                    {submitting[question.id] ? 'Submitting...' : 'Submit Answer'}
                  </button>
                  {successMessage[question.id] && (
                    <div className="success-message">{successMessage[question.id]}</div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageQA;