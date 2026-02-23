import React from 'react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

/**
 * Wrapper that animates children when they scroll into view.
 * Add anim-delay-1, anim-delay-2, etc. for stagger.
 */
function AnimateOnScroll({ children, className = '', as: Tag = 'div', ...props }) {
  const [ref, isInView] = useAnimateOnScroll();

  return (
    <Tag
      ref={ref}
      className={`anim-ready ${isInView ? 'anim-in' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default AnimateOnScroll;
