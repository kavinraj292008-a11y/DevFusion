import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`glass-card rounded-xl p-5 border border-slate-800/80 ${className}`}>
    {children}
  </div>
);
