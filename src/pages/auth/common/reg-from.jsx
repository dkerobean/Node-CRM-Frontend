import React, { useState } from "react";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button"; // Import the Button component
import axios from "axios"; // Import axios for API calls

const schema = yup
  .object({
    ownerName: yup.string().required("Name is Required"),
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password shouldn't be more than 20 characters")
      .required("Please enter password"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is Required"),
    orgName: yup.string().required("Organization name is Required"),
  })
  .required();

const RegForm = () => {
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true); // Set loading state to true when submitting
    try {
      // Send registration request to the backend API
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/register`,
        {
          ownerName: data.ownerName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          orgName: data.orgName,
        }
      );

      if (response.status === 201) {
        // Save token to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem('userEmail', response.data.email);
        localStorage.setItem('userId', response.data._id);

        // Show success message and redirect to verify email page
        toast.success("Registration successful! Please check your email to verify your account.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Redirect to /verify-email after a short delay
        setTimeout(() => {
          navigate("/verify-email");
        }, 1000);
      }
    } catch (error) {
      // Display error response from API
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message || "Registration failed"
          : "Registration failed";
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
    } finally {
      setIsLoading(false); // Reset loading state after submission
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Textinput
        name="ownerName"
        label="Name"
        type="text"
        placeholder="Enter your name"
        register={register}
        error={errors.ownerName}
        className="h-[48px]"
      />
      <Textinput
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        register={register}
        error={errors.email}
        className="h-[48px]"
      />
      <Textinput
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        register={register}
        error={errors.password}
        className="h-[48px]"
      />
      <Textinput
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        register={register}
        error={errors.confirmPassword}
        className="h-[48px]"
      />
      <Textinput
        name="orgName"
        label="Organization Name"
        type="text"
        placeholder="Enter your organization name"
        register={register}
        error={errors.orgName}
        className="h-[48px]"
      />
      <Checkbox
        label="You accept our Terms and Conditions and Privacy Policy"
        value={checked}
        onChange={() => setChecked(!checked)}
      />

      {/* Use Button component and show loading state */}
      <Button
        type="submit"
        className="btn btn-dark block w-full text-center"
        isLoading={isLoading}
      >
        Create an account
      </Button>
    </form>
  );
};

export default RegForm;
