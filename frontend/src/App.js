import React, { useState } from "react";
import "./quiz.css";
import "./video.css";


function App() {
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVideos([]);
    setShowQuiz(false);        
    setQuizData(null);          
    setSelectedAnswers({});     

    try {
      //127.0.0.1 -> for local
      const response = await fetch(`https://edutube.cs.vt.edu/api/recommend_videos/`, {
      // const response = await fetch(`http://127.0.0.1:8000/recommend_videos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, user_level: level, details }),
      });

      const data = await response.json();
      setVideos(data.videos);
    } catch (err) {
      console.error("Error fetching videos:", err);
      alert("Something went wrong! Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setSelectedAnswers({});
    try {
      const transcript = videos.map(v => v.transcript).join(" ");
      const response = await fetch("http://127.0.0.1:8000/generate_quiz/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, user_level: level, transcript, details }),
      });
      const data = await response.json();
      setQuizData(data.questions);
      setShowQuiz(true);
    } catch (err) {
      alert("Quiz failed to load.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="video-page">
      <div className="video-wrapper">
        <h1>
          EduTube AI
        </h1>
        

        <form onSubmit={handleSubmit} className="input-section">
          <input
            type="text"
            placeholder="What do you want to learn? (e.g. Binary Search)"
            className="input-field"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
          
          <textarea
            type="text"
            className="input-field-detail"
            placeholder="Tell us more about it!  (e.g., step-by-step explanation, use case, code examples)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={5}
          />


          <select
            className="input-select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              Select your knowledge level!
            </option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <button
            type="submit"
            className="input-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-dots">
                <span>L</span>
                <span>o</span>
                <span>a</span>
                <span>d</span>
                <span>i</span>
                <span>n</span>
                <span>g</span>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : (
              "Search"
            )}
          </button>
        </form>


        {!showQuiz && videos.length > 0 && (
        <div className="mt-8">
          {/* For debuging!! */}
          {console.log("Rendering videos:", videos)}


          <div className="video-section">
            {videos.map((video, index) => (
              <div key={video.video_id} className="video-card">
                <iframe
                  className="video-iframe"
                  src={`https://www.youtube.com/embed/${video.video_id}`}
                  title={`Video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

                <div className="video-content">
                  <h2 className="video-title">{video.title}</h2>
                  <p className="video-reason">{video.reason}</p>
                  <p><strong>Requirements:</strong> {video.requirements}</p>
                  <div className="video-meta">
                    <span className="video-score">Score: {video.score}/10</span>
                    <span className="video-index">Video {index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
        {videos.length > 0 && !showQuiz && (
          <div className="quiz-button-container">
            <button
              onClick={handleGenerateQuiz}
              className="quiz-button"
              disabled={loading}
            >
              {loading ? (
              <span className="loading-dots">
                <span>Generating</span>
                <span>Questions</span>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : (
              "Take Quiz"
            )}
            </button>
          </div>
        )}

        {showQuiz && quizData && (
          <div className="mt-8 bg-white p-6 rounded shadow">
            <h2>Quiz</h2>
            {quizData.map((q, qi) => (
              <div key={qi} className="mb-6">
                <p className="font-medium">{q.question}</p>
                <div className="mt-2 space-y-1">
                  {q.options.map((opt, oi) => {
                    const isSelected = selectedAnswers[qi] === opt[0];
                    const isCorrect = q.answer === opt[0];
                    return (
                      <div
                        key={oi}
                        onClick={() =>
                          setSelectedAnswers({ ...selectedAnswers, [qi]: opt[0] })
                        }
                        className={`quiz-option ${
                          isSelected
                            ? isCorrect
                              ? "correct"
                              : "incorrect"
                            : ""
                        }`}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>
                {selectedAnswers[qi] && (
                  <p className="text-sm mt-1 text-gray-700">
                    {selectedAnswers[qi] === q.answer
                      ? "Correct!"
                      : `Wrong. ${q.explanation}`}
                  </p>
                )}
              </div>
            ))}
            <div className="text-center">
              <button
                onClick={() => setShowQuiz(false)}
                className="quiz-button"
              >
                Back to Videos
              </button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

export default App;
