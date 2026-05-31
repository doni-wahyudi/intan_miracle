import { useEffect } from 'react';

export default function useScrollAnimation(triggerDeps = []) {
  useEffect(() => {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    if (animateElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    animateElements.forEach((el, index) => {
      // Avoid overriding if already visible
      if (!el.classList.contains('visible')) {
        el.style.transitionDelay = `${index * 0.08}s`;
        observer.observe(el);
      }
    });

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
    };
  }, triggerDeps);
}
