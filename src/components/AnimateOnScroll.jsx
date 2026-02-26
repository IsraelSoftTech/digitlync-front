import React from 'react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

const DIRECTION_MAP = {
  left: 'anim-swipe-left',
  right: 'anim-swipe-right',
  'fade-up': 'anim-fade-up',
  'fade-in': 'anim-fade-in',
  'scale-in': 'anim-scale-in',
};

/**
 * Wrapper that animates children when they scroll into view.
 * direction: 'left' | 'right' | 'fade-up' | 'fade-in' | 'scale-in' (default: 'left')
 * Add anim-delay-1, anim-delay-2, etc. for stagger.
 */
function AnimateOnScroll({ children, className = '', direction = 'left', as: Tag = 'div', ...props }) {
  const [ref, isInView] = useAnimateOnScroll();
  const animClass = DIRECTION_MAP[direction] || DIRECTION_MAP.left;

  return (
    <Tag
      ref={ref}
      className={`anim-ready ${animClass} ${isInView ? 'anim-in' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default AnimateOnScroll;
