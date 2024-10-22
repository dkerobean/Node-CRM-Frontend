import React, { useState } from "react";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";

import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";

const EmailVerification = () => {
  const [isDark] = useDarkMode();
  const [code, setCode] = useState(new Array(5).fill("")); // Array to hold 5 digits

  // Handle code input
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);

    // Automatically focus the next input field
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = () => {
    const verificationCode = code.join(""); // Join the 5 digits into a single string
    // Handle verification logic (e.g., send the code to the backend)
    console.log("Verification code entered:", verificationCode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src={isDark ? LogoWhite : Logo}
              alt="Logo"
              className="mx-auto mb-6"
            />
          </Link>
          <h4 className="font-medium mb-4 text-xl text-gray-700 dark:text-white">
            Email Verification
          </h4>
          <p className="text-slate-500 dark:text-slate-400">
            Enter the 5-digit code sent to your email.
          </p>
        </div>

        {/* Code Input */}
        <div className="flex justify-center gap-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              className="w-12 h-12 text-center text-lg border dark:bg-slate-700 dark:text-white border-slate-300 dark:border-slate-600 rounded"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Verify Email
        </button>

        <div className="text-center mt-6 text-slate-500 dark:text-slate-400">
          Didn’t receive the code?
          <Link
            to="#"
            className="text-blue-600 dark:text-white font-medium hover:underline ml-2"
          >
            Resend Code
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
