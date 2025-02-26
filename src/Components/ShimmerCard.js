import React from 'react';

const ShimmerCard = () => {
  return (
    <div className='border-4 border-black rounded-lg w-fit h-fit top-20 bg-black md:mx-auto mx-4 p-4 animate-pulse'>
      {/* Image shimmer */}
      <div className='w-96 h-96 bg-gray-700 rounded-md'></div>
      
      {/* Text shimmer */}
      <div className='mt-3 px-3'>
        <div className='h-6 bg-gray-600 rounded w-3/4 mb-2'></div>
        <div className='h-6 bg-gray-600 rounded w-1/4'></div>
      </div>
      
      {/* Buttons shimmer */}
      <div className='flex gap-5 my-5 justify-center'>
        <div className='w-24 h-10 bg-gray-700 rounded-md'></div>
        <div className='w-24 h-10 bg-gray-700 rounded-md'></div>
      </div>
    </div>
  );
};

export default ShimmerCard;
