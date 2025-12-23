import type { SVGProps } from 'react';

const HelmetIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5V13h9V6.5A4.5 4.5 0 0 0 12 2z" />
    <path d="M3 13h18" />
    <path d="M18 13a6 6 0 0 1-12 0" />
  </svg>
);

export default HelmetIcon;
