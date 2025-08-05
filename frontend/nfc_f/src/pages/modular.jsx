// src/assets/Modular.jsx
import React, { useEffect, useState } from "react";
import "./Modular.css";

// Playlist IDs mapped to topics
const PLAYLISTS = [
  { 
    label: "ReactJS",
    id: "PLillGF-RfqbZTASqIqdvm1R5mLrQq79CU"
  },
  { 
    label: "Python",
    id: "PLu0W_9lII9agwh1XjRt242xIpHhPT2llg"
  },
  { 
    label: "DSA",
    id: "PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt"
  },
  { 
    label: "Java",
    id: "PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q"
  },
  {
    label: "Machine Learning",
    id: "PLxCzCOWd7aiEXg5BV10k9THtjnS48yI-T"
  },
  {
    label: "HTML/CSS",
    id: "PLillGF-RfqbZ2ybcoD2OaabW2P7Ws8CWu"
  },

  {
    label: "FINANCE MANAGEMENT",
    id: "PL3uUjzLk6PulhRop_ffNeHyK0kprzO4cT"
  }
];

const YOUTUBE_API_KEY = "AIzaSyCQlFpZ478KzLhNO6thH8avcn4X5X8rgLE";

const getPlaylistItemsURL = (playlistId) =>
  `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=6&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`;

const Modular = () => {
  const [videos, setVideos] = useState({});

  useEffect(() => {
    PLAYLISTS.forEach(({ id }) => {
      fetch(getPlaylistItemsURL(id))
        .then((res) => res.json())
        .then((data) => {
          setVideos((prev) => ({
            ...prev,
            [id]: data.items || [],
          }));
        });
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="modular-bg">
      <h1 className="modular-title">Modular Learning Hub</h1>
      <div className="modular-grid">
        {PLAYLISTS.map(({ label, id }) => (
          <div className="modular-card" key={id}>
            <h2>{label}</h2>
            <div className="modular-videos">
              {(videos[id] || []).map((item) => (
                <a
                  key={item.id || item.snippet.resourceId.videoId}
                  href={`https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modular-thumbnail"
                  title={item.snippet.title}
                >
                  <img
                    src={item.snippet.thumbnails.medium.url}
                    alt={item.snippet.title}
                  />
                  <span className="modular-vid-title">
                    {item.snippet.title.length > 40
                      ? item.snippet.title.slice(0, 40) + "..."
                      : item.snippet.title}
                  </span>
                </a>
              ))}
            </div>
            <a
              href={`https://www.youtube.com/playlist?list=${id}`}
              className="modular-playlist-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Full Playlist →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Modular;