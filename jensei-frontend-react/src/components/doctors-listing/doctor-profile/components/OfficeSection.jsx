import React from 'react';

const OfficeSection = ({ office }) => (
  <div className="flex flex-col gap-5 items-start w-full mb-8">
    <p className="font-semibold text-xl text-black w-full">Office</p>
    <div className="bg-white border border-[rgba(0,0,0,0.1)] flex flex-col gap-2.5 items-center justify-center p-6 lg:p-7 rounded-2xl w-full">
      <div className="flex flex-col lg:flex-row gap-5 items-center w-full">
        <div className="h-[193px] rounded-xl w-full lg:w-[316px] relative overflow-hidden">
          <img
            alt="Office"
            className="w-full h-full object-cover rounded-xl"
            src="/doctors-listing/office-img.png"
          />
        </div>
        <div className="flex flex-col gap-2.5 items-start flex-1">
          <p className="font-semibold text-lg text-black w-full">{office.location}</p>
          <p className="font-normal text-sm text-[rgba(0,0,0,0.6)] leading-relaxed w-full lg:w-[218px] whitespace-pre-line">
            {office.address}
          </p>
          <p className="font-medium text-base text-[rgba(0,0,0,0.8)]">{office.hours}</p>
          <p className="font-medium text-base text-[rgba(0,0,0,0.8)]">{office.phone}</p>
        </div>
        <div className="relative rounded-xl w-full lg:w-[466px] h-[193px] overflow-hidden">
          <img
            alt="Map"
            className="w-full h-full object-cover rounded-xl"
            src={office.mapImage}
          />
          <div className="absolute bg-white flex gap-1 items-center justify-center px-2.5 py-0.5 rounded-md top-[155px] left-4">
            <p className="font-medium text-xs text-[rgba(0,0,0,0.8)] whitespace-nowrap">{office.distance}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OfficeSection;
