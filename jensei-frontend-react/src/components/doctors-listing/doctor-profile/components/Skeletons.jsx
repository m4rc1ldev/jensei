import React from 'react';

// Skeleton loading component for calendar
export const CalendarSkeleton = () => (
  <div className="w-full animate-pulse">
    {/* Month header skeleton */}
    <div className="flex items-center justify-between mb-4">
      <div className="bg-gray-200 rounded h-5 w-32" />
      <div className="flex gap-2">
        <div className="bg-gray-200 rounded-full h-7 w-7" />
        <div className="bg-gray-200 rounded-full h-7 w-7" />
      </div>
    </div>
    {/* Day headers skeleton */}
    <div className="grid grid-cols-7 gap-1 mb-2">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex justify-center">
          <div className="bg-gray-200 rounded h-3 w-6" />
        </div>
      ))}
    </div>
    {/* Date cells skeleton (3 rows) */}
    {[...Array(3)].map((_, row) => (
      <div key={row} className="grid grid-cols-7 gap-1 mb-1">
        {[...Array(7)].map((_, col) => (
          <div key={col} className="flex justify-center py-2">
            <div className="bg-gray-200 rounded-full h-8 w-8" />
          </div>
        ))}
      </div>
    ))}
  </div>
);

// Skeleton loading component for time slots
export const SlotGridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-gray-100 rounded-lg h-[44px] animate-pulse" />
    ))}
  </div>
);
