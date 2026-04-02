import React from 'react';
import '../../styles/shadcn-compiled.css';

export const ShadcnWrapper = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-3xl mx-auto p-6 text-foreground ${className}`} style={{ fontFamily: 'var(--font-sans)' }}>
    {children}
  </div>
);
