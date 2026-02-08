import React from 'react';

const ReviewsSection = ({ reviews }) => (
  <div className="flex flex-col gap-5 items-start w-full mb-8">
    <div className="flex items-start justify-between w-full">
      <p className="font-semibold text-xl text-black">Review</p>
      <p className="font-normal text-base text-[rgba(0,0,0,0.6)] cursor-pointer hover:underline">See All</p>
    </div>
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-between w-full">
      {reviews.map((review, index) => (
        <div key={index} className="bg-white border border-[rgba(0,0,0,0.1)] flex flex-col gap-2.5 items-start p-6 lg:p-7 rounded-2xl w-full lg:w-[534px]">
          <div className="flex flex-col gap-3.5 items-start w-full">
            <div className="flex gap-2.5 items-center">
              <div className="relative w-12.5 h-12.5">
                <img
                  alt={review.name}
                  className="w-full h-full object-cover rounded-full"
                  src={review.avatar}
                />
              </div>
              <div className="flex flex-col items-start w-[124px]">
                <p className="font-semibold text-base text-black w-full">{review.name}</p>
                <div className="flex gap-1.5 items-center w-full">
                  <div className="flex gap-0.5 items-center">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4">
                        <img
                          alt="Star"
                          className="w-full h-full object-contain"
                          src="/doctors-listing/073c8576998304b0ed35ff5f6c63c77334a7d266.svg"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="font-medium text-base text-[rgba(0,0,0,0.8)] whitespace-nowrap">{review.rating}</p>
                </div>
              </div>
            </div>
            <p className="font-normal text-base text-[rgba(0,0,0,0.6)] leading-relaxed w-full">
              {review.comment}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ReviewsSection;
