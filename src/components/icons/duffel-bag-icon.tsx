import type { SVGProps } from 'react';

const DuffelBagIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M20 6.4c0-2.2-2.4-4-5.3-4S9.4 4.2 9.4 6.4c0 .8.5 1.7 1.2 2.6L4 12v6h16v-6l-6.6-3c.7-.9 1.2-1.8 1.2-2.6Z" />
    <path d="M4.2 12h15.6" />
    <path d="M7.8 12c.7 1.3 2 2.6 4.2 2.6s3.5-1.3 4.2-2.6" />
    <path d="M10 18H8" />
    <path d="M16 18h-2" />
  </svg>
);

export default DuffelBagIcon;
