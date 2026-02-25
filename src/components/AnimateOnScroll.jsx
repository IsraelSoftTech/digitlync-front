import React from 'react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

/**
 * Wrapper that animates children when they scroll into view.
 * direction: 'left' | 'right' - swipe from left or right (default: 'left')
 * Add anim-delay-1, anim-delay-2, etc. for stagger.
 */
function AnimateOnScroll({ children, className = '', direction = 'left', as: Tag = 'div', ...props }) {
  const [ref, isInView] = useAnimateOnScroll();
  const swipeClass = direction === 'right' ? 'anim-swipe-right' : 'anim-swipe-left';

  return (
    <Tag
      ref={ref}
      className={`anim-ready ${swipeClass} ${isInView ? 'anim-in' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default AnimateOnScroll;
