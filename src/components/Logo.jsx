// src/components/Logo.jsx
import React from 'react';

export const EstrellaFarmaLogo = () => (
  <div className="flex items-center justify-center w-full mb-8 md:mb-12">
    <svg
      aria-hidden="true"
      className="text-orange-500 mr-3 sm:mr-4 flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12"
      width="50"
      height="50"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
        <path d="M12 8V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 11.5H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">EstrellaFarma</h1>
  </div>
);
