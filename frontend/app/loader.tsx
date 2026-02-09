"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="flex h-full min-h-[300px] w-full items-center justify-center">
      <div className="relative">
        {/* The Track (Light Ring) */}
        <div className="h-12 w-12 rounded-full border-4 border-gray-100"></div>
        
        {/* The Spinner (Blue Ring) */}
        <div className="absolute top-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600"></div>
      </div>
    </div>
  );
}