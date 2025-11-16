import { useRef } from "react";

export const useSwipe = (onLeft: () => void, onRight: () => void) => {
  const startX = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - startX.current;
    if (diff > 80) onRight();
    else if (diff < -80) onLeft();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
  };

  const onMouseUp = (e: React.MouseEvent) => {
    const diff = e.clientX - startX.current;
    if (diff > 80) onRight();
    else if (diff < -80) onLeft();
  };

  return { onTouchStart, onTouchEnd, onMouseDown, onMouseUp };
};
