// components/ui/collapsible.jsx
"use client"
import React, { useState } from 'react'

export function Collapsible({ children, className }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        if (child.type.displayName === 'CollapsibleTrigger') {
          return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen) });
        }
        if (child.type.displayName === 'CollapsibleContent') {
          return isOpen ? child : null;
        }
        return child;
      })}
    </div>
  );
}

export function CollapsibleTrigger({ children, onClick, className }) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

export function CollapsibleContent({ children, className }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
CollapsibleContent.displayName = 'CollapsibleContent';
