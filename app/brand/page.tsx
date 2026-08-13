'use client';

import React from 'react';
import { BrandDAMModule } from '@/components/BrandDAMModule';

export default function BrandDAMPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0C0D12] text-[#0F172A] dark:text-[#F8FAFC] font-sans selection:bg-pink-500 selection:text-white py-8">
      <BrandDAMModule />
    </div>
  );
}
