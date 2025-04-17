import React from "react";

const ShimmerCard = () => {
  return (
    <div className='border-4 border-black rounded-lg w-full max-w-sm md:max-w-md lg:max-w-lg h-fit bg-black mx-auto p-4 animate-pulse'>
      <div className='w-full h-72 md:h-80 lg:h-96 bg-gray-700 rounded-md'></div>

      <div className='mt-3 space-y-2'>
        <div className='h-6 bg-gray-700 rounded w-3/4'></div>
        <div className='h-5 bg-gray-700 rounded w-1/4'></div>
      </div>

      <div className='flex gap-5 my-5 justify-center'>
        <div className='w-24 h-10 bg-gray-700 rounded'></div>
        <div className='w-24 h-10 bg-gray-700 rounded'></div>
      </div>
    </div>
  );
};

export default ShimmerCard;
