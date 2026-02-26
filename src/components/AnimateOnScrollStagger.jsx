import React from 'react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

const DELAY_CLASSES = ['anim-delay-1', 'anim-delay-2', 'anim-delay-3', 'anim-delay-4', 'anim-delay-5', 'anim-delay-6', 'anim-delay-7', 'anim-delay-8'];

/**
 * Wraps children and animates each with a stagger when the container scrolls into view.
 * effect: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right'
 */
function AnimateOnScrollStagger({ children, className = '', effect = 'fade-up', as: Tag = 'div', ...props }) {
  const [ref, isInView] = useAnimateOnScroll({ threshold: 0.08 });
  const effectClass = effect === 'slide-left' ? 'anim-swipe-left' : effect === 'slide-right' ? 'anim-swipe-right' : `anim-${effect}`;

  return (
    <Tag ref={ref} className={`anim-stagger-parent ${isInView ? 'anim-stagger-in' : ''} ${className}`.trim()} {...props}>
      {React.Children.map(children, (child, i) => {
        if (!child || typeof child !== 'object') return child;
        const delayClass = DELAY_CLASSES[Math.min(i, DELAY_CLASSES.length - 1)];
        return (
          <div key={child.key ?? i} className={`anim-stagger-child anim-ready ${effectClass} ${delayClass}`}>
            {child}
          </div>
        );
      })}
    </Tag>
  );
}

export default AnimateOnScrollStagger;
