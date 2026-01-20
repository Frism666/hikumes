
import React, { forwardRef } from 'react';
import { IDCardData, InstitutionType } from '../types';

interface IDCardProps {
  data: IDCardData;
}

const IDCard = forwardRef<HTMLDivElement, IDCardProps>(({ data }, ref) => {
  const isUni = data.schoolType === InstitutionType.UNIVERSITY;
  
  // Simulation of high-security micro-pattern
  const MicroPattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="guilloche" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M0 50 C 20 0, 80 0, 100 50 C 80 100, 20 100, 0 50" fill="none" stroke="#004a87" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#004a87" strokeWidth="0.2" />
          <path d="M10 10 L90 90 M90 10 L10 90" stroke="#004a87" strokeWidth="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#guilloche)" />
    </svg>
  );

  const Barcode = () => {
    const bars = [1, 2, 1, 3, 2, 1, 1, 2, 4, 1, 2, 1, 3, 1, 2, 2, 1, 1, 3, 2, 1, 2, 1, 4, 2, 1, 2, 1, 3, 1, 2, 4, 1, 2];
    return (
      <div className="flex items-stretch h-11 bg-white px-2 py-1.5 border border-gray-200 shadow-inner">
        {bars.map((weight, i) => (
          <div 
            key={i} 
            className="bg-black mr-[0.5px]" 
            style={{ width: `${weight}px` }}
          />
        ))}
      </div>
    );
  };

  return (
    <div 
      ref={ref}
      className="relative w-[640px] h-[380px] bg-white rounded-[18px] shadow-2xl overflow-hidden border border-gray-400 flex flex-col font-sans select-none"
      style={{ 
        minWidth: '640px', 
        minHeight: '380px',
        background: 'linear-gradient(145deg, #ffffff 0%, #f0f4f8 100%)',
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3), inset 0 0 2px 2px rgba(255,255,255,0.9), inset 0 -2px 10px rgba(0,0,0,0.05)'
      }}
    >
      {/* 1. PHYSICAL PLASTIC TEXTURE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[60] bg-[url('https://www.transparenttextures.com/patterns/p6-for-air.png')]"></div>

      {/* 2. SECURITY PATTERNS */}
      <MicroPattern />
      
      {/* 3. DYNAMIC RAINBOW HOLOGRAPHIC OVERLAY */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.04] bg-gradient-to-tr from-red-500 via-green-400 to-blue-500 mix-blend-overlay"></div>

      {/* Header Bar */}
      <div className="relative z-10 bg-[#004a87] h-[60px] flex items-center px-7 justify-between shadow-lg border-b-2 border-[#e2bd4e]/30">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner border border-gray-200">
              <i className={`fas ${isUni ? 'fa-building-columns' : 'fa-school'} text-[#004a87] text-xl`}></i>
           </div>
           <div className="flex flex-col">
              <h1 className="text-white font-black text-xl uppercase tracking-tighter leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                {data.schoolName}
              </h1>
              <span className="text-[#e2bd4e] text-[10px] font-black tracking-[0.3em] uppercase mt-0.5">
                {isUni ? 'University Academic' : 'High School Academic'}
              </span>
           </div>
        </div>
        <div className="text-right">
          <div className="text-white/60 text-[9px] font-black tracking-[0.2em] uppercase leading-none">
            DEPT OF EDUCATION
          </div>
          <div className="text-[#e2bd4e] text-[10px] font-black tracking-[0.1em] uppercase mt-1">
            OFFICIAL ID
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="relative z-10 flex flex-grow p-8 pt-6">
        
        {/* Left Column: Photo Area */}
        <div className="flex flex-col items-start w-[180px] mr-10">
          {/* Detailed 3D Metal Smart Chip */}
          <div className="w-[52px] h-[40px] bg-gradient-to-br from-[#ffd700] via-[#f7d14d] to-[#8b6914] rounded-lg mb-5 shadow-[0_2px_5px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)] border border-black/10 relative overflow-hidden">
             <div className="absolute inset-0 flex flex-wrap opacity-50">
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} className="w-1/3 h-1/4 border-[0.5px] border-black/40"></div>
                ))}
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-6 border-x border-black/20"></div>
          </div>

          <div className="relative w-40 h-52">
            {/* Portrait Container */}
            <div className="w-full h-full border-[3px] border-[#004a87] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] overflow-hidden p-0.5 relative ring-1 ring-black/5">
              <img 
                src={data.photoUrl} 
                alt="Portrait" 
                className="w-full h-full object-cover contrast-[1.05]"
              />
              {/* Over-image Security Watermark */}
              <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center rotate-[-30deg]">
                <span className="text-[10px] font-black text-black uppercase tracking-[0.5em] whitespace-nowrap">
                  ORIGINAL • ORIGINAL • ORIGINAL
                </span>
              </div>
            </div>
            
            {/* Physical Gold Seal */}
            <div className="absolute -bottom-4 -right-5 w-16 h-16 bg-gradient-to-br from-[#d4af37] via-[#f9d71c] to-[#996515] rounded-full border-[4px] border-white shadow-[0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center z-20">
               <i className="fas fa-award text-white text-3xl drop-shadow-md"></i>
               <div className="absolute inset-0 rounded-full border border-black/10 scale-90"></div>
            </div>
          </div>
        </div>

        {/* Right Column: Text Information */}
        <div className="flex-grow flex flex-col pt-1">
          <div className="mb-6 relative">
            <span className="text-[11px] font-black text-[#004a87]/60 uppercase tracking-widest">Full Legal Name</span>
            {/* Engraved Effect Teks */}
            <h2 className="text-[38px] font-black text-gray-900 uppercase leading-[0.8] mt-2 tracking-tighter"
                style={{ textShadow: '0 1px 0 rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)' }}>
              {data.firstName}<br/>{data.lastName}
            </h2>
            
            {/* GHOST PHOTO WITH HALFTONE SIMULATION */}
            <div className="absolute top-0 right-0 w-[70px] h-[90px] border border-gray-300 shadow-sm overflow-hidden bg-white/50 p-0.5 pointer-events-none">
                <img src={data.photoUrl} className="w-full h-full object-cover grayscale brightness-125 opacity-30 contrast-150" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6">
            <div className="border-l-4 border-[#004a87] pl-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID Number</span>
              <p className="text-lg font-black text-gray-800 font-mono tracking-tighter">{data.studentId}</p>
            </div>
            <div className="border-l-4 border-[#004a87] pl-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cohort</span>
              <p className="text-lg font-black text-[#004a87]">CLASS OF {data.enrollmentYear}</p>
            </div>
            <div className="col-span-2 border-l-4 border-[#004a87] pl-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isUni ? 'Major / Program' : 'Academic Grade'}</span>
              <p className="text-lg font-black text-gray-700 uppercase truncate">{data.majorOrGrade}</p>
            </div>
          </div>

          {/* Validity Box */}
          <div className="flex justify-between items-center py-2.5 px-5 border border-slate-300 bg-slate-50/90 rounded-xl mb-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase">Issue Date</span>
                <span className="text-sm font-bold text-slate-700">{data.issueDate}</span>
             </div>
             <div className="w-[2px] h-8 bg-slate-200"></div>
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-red-400 uppercase tracking-wider">Expiration Date</span>
                <span className="text-sm font-black text-red-600">{data.expiryDate}</span>
             </div>
          </div>
          
          <div className="flex justify-between items-end mt-4">
             <div className="flex flex-col">
                <div className="signature-font text-3xl text-[#004a87] opacity-60 mb-[-10px] rotate-[-1deg] select-none">
                  {data.firstName} {data.lastName}
                </div>
                <div className="w-32 h-[1px] bg-gray-300"></div>
                <span className="text-[8px] text-gray-400 uppercase font-black tracking-widest mt-1">Holder Signature</span>
             </div>
             <div className="flex flex-col items-center">
                <div className="relative group">
                  <Barcode />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
                <span className="text-[9px] font-mono text-gray-400 mt-1.5 font-bold tracking-widest">{data.studentId}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Footer Branding Area */}
      <div className="bg-[#f1f5f9] border-t-2 border-slate-200 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center">
           <div className="w-10 h-10 bg-white border border-slate-300 p-1 mr-5 shadow-sm rounded-sm">
             <div className="w-full h-full flex flex-wrap">
                {Array.from({length: 100}).map((_, i) => (
                  <div key={i} className={`w-[10%] h-[10%] ${Math.random() > 0.4 ? 'bg-black' : 'bg-white'}`}></div>
                ))}
             </div>
           </div>
           <div className="flex flex-col">
             <span className="text-[8px] font-black text-[#004a87] uppercase tracking-widest">Valid Institution Record</span>
             <p className="text-[11px] font-bold text-slate-600 leading-none mt-1">
               {data.schoolAddress}, {data.city} {data.state}
             </p>
           </div>
        </div>
        <div className="text-right flex flex-col items-end opacity-20">
           <i className="fas fa-shield-halved text-2xl text-[#004a87]"></i>
           <span className="text-[7px] font-black text-[#004a87] mt-1">SECURE DOC</span>
        </div>
      </div>

      {/* FINAL PLASTIC SHEEN LIGHTING */}
      <div className="absolute inset-0 z-[100] pointer-events-none opacity-[0.05] bg-gradient-to-br from-white via-transparent to-black/20"></div>
    </div>
  );
});

IDCard.displayName = 'IDCard';

export default IDCard;
