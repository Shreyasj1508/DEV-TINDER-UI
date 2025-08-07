// Simple hook for swipe gesture detection (touch and mouse)
import { useRef, useEffect } from "react";

export function useSwipe(onSwipe, options = {}) {
  const ref = useRef(null);
  const threshold = options.threshold || 60; // px
  let startX = null;
  let startY = null;
  let isTouch = false;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onTouchStart(e) {
      isTouch = true;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    }
    function onTouchEnd(e) {
      if (!isTouch || startX === null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      handleSwipe(dx, dy);
      startX = startY = null;
      isTouch = false;
    }
    function onMouseDown(e) {
      if (isTouch) return;
      startX = e.clientX;
      startY = e.clientY;
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    function onMouseMove(e) {}
    function onMouseUp(e) {
      if (startX === null) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      handleSwipe(dx, dy);
      startX = startY = null;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    function handleSwipe(dx, dy) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
        onSwipe(dx > 0 ? "right" : "left");
      } else if (Math.abs(dy) > threshold) {
        onSwipe(dy < 0 ? "up" : "down");
      }
    }
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("mousedown", onMouseDown);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onSwipe, threshold]);
  return ref;
}
