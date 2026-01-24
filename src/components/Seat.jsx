import React, { memo } from "react";
import { Armchair, X, Lock } from "lucide-react";

const Seat = ({ seatNumber, status, isSelected, onSelect }) => {
  const isBooked = status === "booked";
  const isLocked = status === "locked";
  const isUnavailable = isBooked || isLocked;

  // Visual logic:
  // If selected -> Selected Style
  // Else if unavailable -> Booked/Locked Style
  // Else -> Available
  
  let baseClasses = "w-9 h-9 flex items-center justify-center rounded-md transition border ";
  let stateClasses = "";
  
  if (isSelected) {
      stateClasses = "bg-yellow-500 text-black border-yellow-400 shadow-[0_0_12px_rgba(255,200,0,0.4)]";
  } else if (isUnavailable) {
      stateClasses = "bg-zinc-800/50 border-zinc-800 text-zinc-600 cursor-not-allowed";
  } else {
      stateClasses = "bg-zinc-800 border-zinc-700 hover:bg-zinc-700";
  }

  return (
    <button
      onClick={() => onSelect(seatNumber)}
      disabled={isUnavailable}
      className={`${baseClasses} ${stateClasses}`}
      aria-label={`Seat ${seatNumber} ${isSelected ? "selected" : status}`}
    >
      {isUnavailable ? (
        isLocked ? <Lock className="w-3 h-3" /> : <X className="w-4 h-4" />
      ) : (
        <Armchair className="w-5 h-5" />
      )}
    </button>
  );
};

// Check if props are equal to prevent re-render
const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.status === nextProps.status &&
    prevProps.seatNumber === nextProps.seatNumber
    // onSelect is expected to be stable via useCallback in parent
  );
};

export default memo(Seat, arePropsEqual);
