import { useEffect } from 'react';

export default function useScrollAnimation(triggerDeps = []) {
  useEffect(() => {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    console.log("[useScrollAnimation] Triggered. Found elements:", animateElements.length);
    if (animateElements.length === 0) return;

    const fallbackTimeout = setTimeout(() => {
      animateElements.forEach((el) => {
        if (!el.classList.contains('visible')) {
          el.classList.add('visible');
        }
      });
    }, 400);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            clearTimeout(fallbackTimeout);
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px' }
    );

    animateElements.forEach((el, index) => {
      // Avoid overriding if already visible
      if (!el.classList.contains('visible')) {
        el.style.transitionDelay = `${index * 0.08}s`;
        observer.observe(el);
      }
    });

    return () => {
      clearTimeout(fallbackTimeout);
      animateElements.forEach((el) => observer.unobserve(el));
    };
  }, triggerDeps);
}
