import React from "react";

const Shimmer = () => {
  return (
    <div className='flex flex-col items-center gap-5 min-h-screen px-3'>
      <h1 className='font-bold text-3xl text-center text-gray-400'>Loading</h1>

      {/* Render 5 shimmering skeletons */}
      {Array(5)
        .fill("")
        .map((_, index) => (
          <div
            key={index}
            className='flex items-center bg-gray-200 shadow-md rounded-lg p-4 md:w-96 gap-4 w-full animate-pulse'
          >
            {/* Shimmer effect for profile image */}
            <div className='w-16 h-16 bg-gray-300 rounded-full'></div>

            {/* Shimmer effect for text */}
            <div className='flex flex-col gap-2 w-full'>
              <div className='h-5 bg-gray-300 rounded-md w-3/4'></div>
              <div className='h-4 bg-gray-300 rounded-md w-1/2'></div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Shimmer;
