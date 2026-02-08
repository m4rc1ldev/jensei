import React from 'react';

const AboutSection = ({ doctor }) => (
  <div className="flex flex-col gap-6 items-start flex-1 w-full min-w-0">
    {/* Biography */}
    <div className="flex flex-col gap-2.5 items-start w-full min-w-0">
      <p className="font-semibold text-xl text-black w-full">About Me</p>
      <p className="font-normal text-sm text-[rgba(0,0,0,0.6)] leading-relaxed w-full max-w-full lg:max-w-[712px] break-words">
        {doctor.biography}
      </p>
    </div>

    {/* Specialized Issues */}
    <div className="flex flex-col gap-2.5 items-start w-full min-w-0">
      <p className="font-semibold text-base text-black w-full">Specialized/Issues</p>
      <div className="flex flex-wrap gap-1.5 items-center w-full min-w-0">
        {doctor.specializedIssues.map((issue, index) => (
          <div key={index} className="bg-[#f2f2f2] flex gap-2.5 items-center justify-center px-2.5 py-1.5 rounded-[18px] shrink-0">
            <p className="font-normal text-sm text-[rgba(0,0,0,0.8)] whitespace-nowrap">{issue}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Qualifications/Experience */}
    <div className="flex flex-col gap-6 items-start w-full min-w-0">
      <div className="flex flex-col gap-2.5 items-start w-full text-base min-w-0">
        <p className="font-semibold text-black w-full">Qualifications/ Experience</p>
        <p className="text-sm font-normal text-[rgba(0,0,0,0.6)] w-full max-w-full lg:max-w-[712px] break-words">License: {doctor.license}</p>
        <p className="text-sm font-normal text-[rgba(0,0,0,0.6)] w-full max-w-full lg:max-w-[712px] break-words">
          {typeof doctor.experience === 'number'
            ? `${doctor.experience} years+`
            : doctor.experience}
        </p>
      </div>
    </div>
  </div>
);

export default AboutSection;
