import { useState, useRef } from "react";
import ReactPlayer from "react-player/youtube";

const LOFI_URL = "https://www.youtube.com/watch?v=IxPANmjPaek";

export const LofiPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  return (
    <>
      {/* Hidden YouTube player — only audio matters */}
      <div
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          width: 1,
          height: 1,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <ReactPlayer
          ref={playerRef}
          url={LOFI_URL}
          playing={playing}
          volume={volume}
          loop
          width={1}
          height={1}
          config={{
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              modestbranding: 1,
            },
          }}
        />
      </div>

      {/* Floating music control bar */}
      <div className="lofi-bar">
        <div className="lofi-bar-inner">
          {/* Animated music icon */}
          <div className={`lofi-visualizer ${playing ? "playing" : ""}`}>
            <span />
            <span />
            <span />
          </div>

          {/* Track name */}
          <span className="lofi-track-name">
            {playing ? "Lofi Girl - Medieval" : "Lofi — Paused"}
          </span>

          {/* Play / Pause button */}
          <button
            className="lofi-btn"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Volume button + slider */}
          <div className="lofi-volume-wrap">
            <button
              className="lofi-btn"
              onClick={() => setShowVolume((v) => !v)}
              aria-label="Volume"
            >
              {volume === 0 ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="18"
                  height="18"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : volume < 0.5 ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="18"
                  height="18"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="18"
                  height="18"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>

            {showVolume && (
              <div className="lofi-volume-popup">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="lofi-volume-slider"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
