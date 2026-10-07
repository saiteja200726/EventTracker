import { useState, useRef } from "react";

function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  // Using a royalty-free ambient track (or silence if unavailable)
  const toggleMusic = () => {
    if (!audioRef.current) {
      // Create a simple ambient oscillator as fallback
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        gainNode.gain.value = 0.05;
        oscillator.frequency.value = 220;
        oscillator.type = "sine";

        if (!playing) {
          oscillator.start();
          audioRef.current = { oscillator, ctx, stop: () => oscillator.stop() };
        }
      } catch {
        // AudioContext not available
      }
    } else {
      if (playing) {
        audioRef.current?.stop?.();
        audioRef.current = null;
      }
    }
    setPlaying(!playing);
  };

  return (
    <button
      className="music-toggle"
      onClick={toggleMusic}
      title={playing ? "Pause ambient music" : "Play ambient music"}
    >
      {playing ? "🔊" : "🔇"}
    </button>
  );
}

export default MusicToggle;
