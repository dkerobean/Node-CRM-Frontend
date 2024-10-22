import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";
import axios from "axios";
import { toast } from "react-toastify";

import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";

const EmailVerification = () => {
  const [isDark] = useDarkMode();
  const [code, setCode] = useState(new Array(5).fill("")); // Array to hold 5 digits
  const [email, setEmail] = useState(""); // State to hold email
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve email from local storage
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      // Handle the case when email is not found in local storage (e.g., redirect to the registration page)
      navigate("/register");
    }
  }, [navigate]);

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

  const handleSubmit = async () => {
    const verificationCode = code.join(""); // Join the 5 digits into a single string

    try {
      // Send verification request to the backend API
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/verify`,
        {
          email,
          code: verificationCode,
        }
      );

      if (response.status === 200) {
        // Show success message
        toast.success("Email verified successfully!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Redirect to /crm after a short delay
        setTimeout(() => {
          navigate("/crm");
        }, 1500);
      }
    } catch (error) {
      // Display error response from API
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message || "Verification failed"
          : "Verification failed";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
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

        {/* Hidden email input */}
        <input type="hidden" value={email} />
      </div>
    </div>
  );
};

export default EmailVerification;
