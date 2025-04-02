/**
 * TypeScript declarations for Tailwind CSS
 */
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// This declaration tells TypeScript that @tailwind directives are valid
interface CSSRule {
  '@tailwind': any;
}
