import React, { memo } from "react";

const Seat = ({ seatNumber, status, isSelected, onSelect }) => {
  const isBooked = status === "booked";
  const isLocked = status === "locked";
  const isUnavailable = isBooked || isLocked;

  // Base aesthetics
  // Available: Dark grey/zinc outline
  // Selected: Bright Yellow/Gold filled
  // Booked: White/Grey filled (faded)
  // Locked: Red/Orange pulse? Or just same as booked but distinct? Locked usually means 'held'.

  let seatColorClass = "fill-zinc-800 stroke-zinc-600";
  
  if (isSelected) {
      seatColorClass = "fill-yellow-500 stroke-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]";
  } else if (isBooked) {
      seatColorClass = "fill-zinc-800/50 stroke-zinc-700 opacity-50"; 
  } else if (isLocked) {
      seatColorClass = "fill-red-900/40 stroke-red-800 opacity-70";
  } else {
      seatColorClass = "fill-zinc-800 stroke-zinc-600 hover:fill-zinc-700 hover:stroke-zinc-500 cursor-pointer";
  }

  return (
    <div className="relative flex justify-center">
      <button
        onClick={() => onSelect(seatNumber)}
        disabled={isUnavailable}
        className={`contents group transition-all duration-300 ${isSelected ? 'scale-110' : 'hover:scale-110'}`}
        aria-label={`Seat ${seatNumber} ${isSelected ? "selected" : status}`}
      >
        <svg 
            width="32" 
            height="32" 
            viewBox="0 0 100 100" 
            className={`transition-all duration-300 ${seatColorClass}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Seat Back */}
            <path 
                d="M20 30 Q20 10 50 10 Q80 10 80 30 V60 H20 Z" 
                className="transition-colors duration-300"
                strokeWidth="4"
            />
            {/* Seat Base */}
            <rect 
                x="15" 
                y="60" 
                width="70" 
                height="20" 
                rx="5" 
                className="transition-colors duration-300"
                strokeWidth="4"
            />
            {/* Arm Rests */}
            <path d="M15 60 V75" strokeWidth="6" strokeLinecap="round" />
            <path d="M85 60 V75" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </button>
      
      {/* Tooltip on Hover */}
      {!isUnavailable && (
        <span className="absolute -top-8 bg-zinc-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-700 z-10">
          {seatNumber}
        </span>
      )}
    </div>
  );
};

// Check if props are equal to prevent re-render
const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.status === nextProps.status &&
    prevProps.seatNumber === nextProps.seatNumber
  );
};

export default memo(Seat, arePropsEqual);

