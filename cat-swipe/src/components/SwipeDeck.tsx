import React, { useState } from "react";
import Card from "./Card";
import type { Cat } from "../redux/catsSlice";

interface Props {
  cats: Cat[];
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SwipeDeck: React.FC<Props> = ({ cats, onSwipeLeft, onSwipeRight }) => {
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDrag({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setDrag({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragging) return;
    const diff = e.clientX - drag.x;
    if (diff > 80) onSwipeRight();
    else if (diff < -80) onSwipeLeft();
    setDragging(false);
    setDrag({ x: 0, y: 0 });
  };

  const topCat = cats[0];

  if (!topCat) return <p>No more cats!</p>;

  return (
    <div
      className="swipe-deck"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={(e) =>
        setDrag({ x: e.touches[0].clientX, y: e.touches[0].clientY })
      }
      onTouchEnd={(e) => {
        const diff = e.changedTouches[0].clientX - drag.x;
        if (diff > 80) onSwipeRight();
        else if (diff < -80) onSwipeLeft();
        setDrag({ x: 0, y: 0 });
      }}
    >
      <Card url={topCat.url} style={{ transform: `translateX(${drag.x}px)` }} />
      <div className="buttons">
        <button onClick={onSwipeLeft}>❌ Dislike</button>
        <button onClick={onSwipeRight}>❤️ Like</button>
      </div>
    </div>
  );
};

export default SwipeDeck;
