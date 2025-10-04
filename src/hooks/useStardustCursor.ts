import { useEffect } from 'react';

export const useStardustCursor = () => {
  useEffect(() => {
    // Create custom cursor element
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.display = 'block';
    cursor.style.visibility = 'visible';
    cursor.style.opacity = '1';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '99999';
    document.body.appendChild(cursor);

    let animationFrameId: number;

    const updateCursor = (e: MouseEvent) => {
      // Update cursor position smoothly
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.display = 'block';
      cursor.style.visibility = 'visible';
      cursor.style.opacity = '1';
      cursor.style.pointerEvents = 'none';
      cursor.style.zIndex = '99999';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(() => updateCursor(e));
    };

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Add mouse move event listener
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto';
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (cursor.parentNode) {
        cursor.parentNode.removeChild(cursor);
      }
    };
  }, []);
};
