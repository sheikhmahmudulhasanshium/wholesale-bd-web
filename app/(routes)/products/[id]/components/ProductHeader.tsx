// @/app/(routes)/products/[id]/components/ProductHeader.tsx

"use client";

import React from 'react';

interface ProductHeaderProps {
  name: string;
  brand?: string;
  model?: string;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ name, brand, model }) => {
  const subHeaderText = [brand, model].filter(Boolean).join(' - ');

  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tighter">
        {name}
      </h1>
      {subHeaderText && (
        <p className="text-lg text-muted-foreground mt-2">{subHeaderText}</p>
      )}
    </div>
  );
};