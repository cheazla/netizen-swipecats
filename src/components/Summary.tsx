import React from "react";
import type { Cat } from "../redux/catsSlice";

interface Props {
  liked: Cat[];
  onRestart: () => void;
}

const Summary: React.FC<Props> = ({ liked, onRestart }) => {
  return (
    <div className="summary">
      <h2>You liked {liked.length} cats 🐱❤️</h2>
      <div className="liked-grid">
        {liked.map((cat) => (
          <img key={cat.id} src={cat.url} className="liked-img" />
        ))}
      </div>
      <button className="restart-btn" onClick={onRestart}>
        Restart
      </button>
    </div>
  );
};

export default Summary;
