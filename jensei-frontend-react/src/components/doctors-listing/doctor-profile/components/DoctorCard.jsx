import React from 'react';

const DoctorCard = ({ doctor }) => (
  <div className="bg-white border border-[rgba(0,0,0,0.1)] flex gap-2.5 items-center p-5 rounded-2xl w-full lg:w-[350px] shrink-0">
    <div className="flex flex-col gap-9 items-start w-full">
      {/* Rating Badges */}
      <div className="flex items-end justify-between w-full">
        <div className="bg-[#edffea] flex gap-1.5 items-center px-2.5 py-1.5 rounded-md">
          <div className="w-5 h-5">
            <img
              alt="Star"
              className="w-full h-full object-contain"
              src="/doctors-listing/8aab98d13f950baa0aea072e0ea6782d67c7d58a.svg"
            />
          </div>
          <p className="font-semibold text-sm text-[#1fbd5c] whitespace-nowrap">
            {typeof doctor.rating === 'number'
              ? doctor.rating.toFixed(1)
              : doctor.rating}
          </p>
        </div>
        <div className="bg-[#ffeff0] flex gap-1.5 items-center px-2.5 py-1.5 rounded-md">
          <div className="w-5 h-5">
            <img
              alt="Star"
              className="w-full h-full object-contain"
              src="/doctors-listing/a63e9aa33df2e8af9e1a9d698bcc4f5ceb2e2ca0.svg"
            />
          </div>
          <p className="font-semibold text-sm text-[#c44143] whitespace-nowrap">{doctor.badge}</p>
        </div>
      </div>

      {/* Doctor Image and Info */}
      <div className="flex flex-col gap-5 items-center w-full">
        <div className="relative w-[122px] h-[122px]">
          <div className="absolute inset-[-19.1%_-17.46%_-15.82%_-17.46%]">
            <img
              alt={doctor.name}
              className="w-full h-full object-cover rounded-full"
              src={doctor.image}
            />
          </div>
        </div>
        <div className="flex flex-col gap-6 items-center w-full">
          <div className="flex flex-col gap-2.5 items-center justify-center w-full">
            <div className="bg-[rgba(240,238,255,0.6)] flex gap-2.5 items-center justify-center px-2 py-1 rounded-md">
              <p className="font-normal text-base text-[#796bff] whitespace-nowrap">{doctor.specialty}</p>
            </div>
            <div className="flex gap-2 items-center justify-center w-full">
              <p className="font-semibold text-xl text-black text-center whitespace-nowrap">{doctor.name}</p>
              <div className="w-6 h-6">
                <img
                  alt="Verified"
                  className="w-full h-full object-contain"
                  src="/doctors-listing/verified-star.svg"
                />
              </div>
            </div>
            <p className="font-normal text-sm text-[rgba(0,0,0,0.6)] whitespace-nowrap">
              <span className="font-bold text-base">{doctor.price}/</span>
              <span className="text-sm"> {doctor.priceType}</span>
            </p>
          </div>
          <div className="flex gap-2.5 items-center">
            <div className="bg-[#ebf4ff] flex gap-2.5 items-center justify-center p-3.5 rounded-xl w-12 h-12">
              <div className="w-6 h-6">
                <img
                  alt="Video Call"
                  className="w-full h-full object-contain"
                  src="/doctors-listing/ed29c247d12ce4589e0ad52beaba45b95fb199a4.svg"
                />
              </div>
            </div>
            <div className="bg-[#ebf4ff] flex gap-2.5 items-center justify-center p-3.5 rounded-xl w-12 h-12">
              <div className="w-6 h-6">
                <img
                  alt="Message"
                  className="w-full h-full object-contain"
                  src="/doctors-listing/14eaec3a0a0793a0116873266449f0e443880203.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Consultation Button */}
      <div className="bg-gradient-to-r from-[#796bff] to-[#4c9eff] border border-[rgba(255,255,255,0.2)] flex flex-col gap-2.5 h-12 items-center justify-center px-7 py-2.5 rounded-xl w-full cursor-pointer hover:opacity-90">
        <p className="font-medium text-lg text-white whitespace-nowrap">Book Consultation</p>
      </div>
    </div>
  </div>
);

export default DoctorCard;
