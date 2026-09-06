'use client';

import React from 'react';
import { BrandDAMModule } from '@/components/BrandDAMModule';

export default function InternalSchemaPage() {
  return (
    <div className="w-full">
      <BrandDAMModule initialTab="schema" />
    </div>
  );
}
