// Swipe detection utility for mobile devices
export const useSwipe = (onSwipeLeft, onSwipeRight, onSwipeUp) => {
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!startX || !startY) return;
    
    endX = e.touches[0].clientX;
    endY = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!startX || !startY || !endX || !endY) return;
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    // Horizontal swipe (left/right)
    if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
      if (deltaX > 0) {
        onSwipeRight && onSwipeRight();
      } else {
        onSwipeLeft && onSwipeLeft();
      }
    }
    // Vertical swipe (up)
    else if (absDeltaY > absDeltaX && absDeltaY > minSwipeDistance && deltaY < 0) {
      onSwipeUp && onSwipeUp();
    }
    
    // Reset values
    startX = startY = endX = endY = 0;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };
};

export default useSwipe;
