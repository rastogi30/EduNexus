import React, { useEffect, useState } from 'react';

const ResendTimer = ({ onResend, initialSeconds = 30 }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft === 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResend = () => {
    onResend(); // Trigger resend action
    setSecondsLeft(initialSeconds); // Reset timer
  };

  return (
    <div className="flex items-center gap-x-2">
      <button
        className="text-blue-100 flex items-center gap-x-2"
        onClick={handleResend}
        disabled={secondsLeft > 0}
      >
        Resend OTP
      </button>
      {secondsLeft > 0 && (
        <span className="text-richblack-100">({secondsLeft}s)</span>
      )}
    </div>
  );
};

export default ResendTimer;
