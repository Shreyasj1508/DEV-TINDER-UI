// Animation utilities for DevTinder

export const createFloatingHeart = (x, y) => {
  const heart = document.createElement('div');
  heart.innerHTML = '❤️';
  heart.className = 'floating-heart';
  heart.style.left = x + 'px';
  heart.style.top = y + 'px';
  heart.style.fontSize = '24px';
  document.body.appendChild(heart);
  
  setTimeout(() => {
    heart.remove();
  }, 3000);
};

export const createFloatingReject = (x, y) => {
  const reject = document.createElement('div');
  reject.innerHTML = '💔';
  reject.className = 'floating-heart';
  reject.style.left = x + 'px';
  reject.style.top = y + 'px';
  reject.style.fontSize = '24px';
  document.body.appendChild(reject);
  
  setTimeout(() => {
    reject.remove();
  }, 3000);
};

export const createFloatingStar = (x, y) => {
  const star = document.createElement('div');
  star.innerHTML = '⭐';
  star.className = 'floating-heart';
  star.style.left = x + 'px';
  star.style.top = y + 'px';
  star.style.fontSize = '24px';
  document.body.appendChild(star);
  
  setTimeout(() => {
    star.remove();
  }, 3000);
};

export const vibrate = () => {
  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
};

export const playSound = (type) => {
  // You can add sound effects here
  if (type === 'like') {
    // Play like sound
  } else if (type === 'reject') {
    // Play reject sound
  }
};
