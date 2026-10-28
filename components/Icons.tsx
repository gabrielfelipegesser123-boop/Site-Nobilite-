type P = { className?: string };
const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const IconWhatsApp = ({ className }: P) => (
  <svg {...base} className={className}><path d="M3.5 20.5l1.2-4.1A8.5 8.5 0 1 1 8 19.4l-4.5 1.1z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.4-2-1-.9.7a4 4 0 0 1-2-2l.7-.9-1-2L9 8.5z" /></svg>
);
export const IconInstagram = ({ className }: P) => (
  <svg {...base} className={className}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></svg>
);
export const IconFacebook = ({ className }: P) => (
  <svg {...base} className={className}><path d="M14 8.5h2V5h-2.5C10.9 5 9.5 6.6 9.5 9v2H7v3.5h2.5V21H13v-6.5h2.5l.5-3.5h-3V9.4c0-.6.3-.9 1-.9z" /></svg>
);
export const IconPin = ({ className }: P) => (
  <svg {...base} className={className}><path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 1 0-13 0c0 5.4 6.5 11 6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>
);
export const IconPhone = ({ className }: P) => (
  <svg {...base} className={className}><path d="M5 4h3.5l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7L15 13l4 1.5V18a2 2 0 0 1-2 2A13 13 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
);
export const IconArrow = ({ className }: P) => (
  <svg {...base} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
