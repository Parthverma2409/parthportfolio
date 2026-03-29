/**
 * Shared mutable progress value so Hero.jsx (DOM) and HeroCanvas.jsx (Three.js useFrame)
 * can both read scroll progress without React re-renders.
 * Updated by Hero.jsx scroll listener, read by HeroCanvas.jsx in useFrame.
 */
export const heroProgress = { value: 0 };
