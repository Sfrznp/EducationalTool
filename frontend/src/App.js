import React, { useState } from "react";
// import { motion } from "framer-motion";


function App() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("beginner");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVideos([]);

    try {
      const response = await fetch("http://127.0.0.1:8000/recommend_videos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, user_level: level }),
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

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 text-gray-800 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white p-100 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center">
          AI Video Recommender
        </h1>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="What do you want to learn? (e.g. Binary Search)"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />

          <select
            className="w-full border border-gray-300 p-3 rounded-md"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <button
            type="submit"
            className={`w-full text-white font-semibold py-3 rounded-md transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex gap-1 text-white font-semibold">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </span>
            ) : (
              "Search"
            )}

          </button>

        </form>
        </div>

        <div className="mt-8">
          {console.log("Rendering videos:", videos)}

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1">
            {videos.map((video, index) => (
              <div
                key={video.video_id}
                className="mb-6 border border-gray-200 p-4 rounded-lg bg-white shadow hover:shadow-xl transform transition duration-300 hover:scale-[1.02]"
                >
                  <h2 className="text-xl font-semibold mb-1 text-gray-900">{video.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{video.reason}</p>
                  <div className="mb-2">
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${video.video_id}`}
                      title={`Video ${index + 1}`}
                      frameBorder="0"
                      className="rounded-md"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">Score: {video.score}/10</p>
                </div>
            
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
