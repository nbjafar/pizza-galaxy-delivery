
import React from 'react';

const PizzaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2a10 10 0 1 0 10 10H2A10 10 0 0 0 12 2z" />
    <path d="M12 12v10" />
    <path d="M8 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
    <path d="M16 15a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
    <path d="M8 15a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
  </svg>
);

export default PizzaIcon;
