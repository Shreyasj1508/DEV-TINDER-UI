// Notification Badge Component for navbar
import React from 'react';

const NotificationBadge = ({ count, className = '' }) => {
  if (!count || count === 0) return null;

  // Format count (show 99+ for counts over 99)
  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <span 
      className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg animate-pulse border-2 border-white ${className}`}
    >
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
