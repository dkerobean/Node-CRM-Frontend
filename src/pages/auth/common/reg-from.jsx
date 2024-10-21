import React, { useState } from "react";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
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

      if (response.status === 200) {
        // Save token to localStorage
        localStorage.setItem("token", response.data.token); // Adjust according to your API response

        // Show success message
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Redirect to home or dashboard after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
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
      <button className="btn btn-dark block w-full text-center">
        Create an account
      </button>
    </form>
  );
};

export default RegForm;
