import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Button from "@/components/ui/Button";
import { useDispatch } from "react-redux";
import { handleLogin, fetchUserData } from "./store"; // Adjust the import path

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();

const LoginForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // const onSubmit = async (data) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_APP_BACKEND_URL}/api/login`,
  //       {
  //         email: data.email,
  //         password: data.password,
  //       }
  //     );

  //     if (response.status === 200) {
  //       const { token } = response.data; // Extract token from response
  //       dispatch(handleLogin({ token })); // Dispatch login action
  //       await dispatch(fetchUserData()); // Fetch user data after login

  //       navigate("project");
  //     }
  //   } catch (error) {
  //     // Handle different server responses
  //     const statusCode = error.response ? error.response.status : 500;
  //     let errorMessage = "Something went wrong";

  //     if (statusCode === 404) {
  //       errorMessage = "Account not found. Please sign up first.";
  //     } else if (statusCode === 401) {
  //       errorMessage = "Incorrect password. Please try again.";
  //     } else if (statusCode === 400) {
  //       errorMessage = error.response.data.message || "Invalid credentials.";
  //     }

  //     toast.error(errorMessage, {
  //       position: "top-right",
  //       autoClose: 1500,
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

const onSubmit = async (data) => {
  setIsLoading(true);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BACKEND_URL}/api/login`,
      { email: data.email, password: data.password }
    );

    if (response.status === 200) {
      const { token } = response.data;
      dispatch(handleLogin({ token }));

      const userFetchResult = await dispatch(fetchUserData());
      if (userFetchResult.meta.requestStatus === "fulfilled") {
        navigate("/project");
      } else {
        throw new Error("User data fetch failed");
      }
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textinput
        name="email"
        label="Email"
        type="email"
        register={register}
        error={errors.email}
        placeholder="Enter your email"
        className="h-[48px]"
      />
      <Textinput
        name="password"
        label="Password"
        type="password"
        register={register}
        error={errors.password}
        placeholder="Enter your password"
        className="h-[48px]"
      />
      <div className="flex justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Forgot Password?
        </Link>
      </div>

      <Button
        text="Sign in"
        type="submit"
        isLoading={isLoading}
        className="btn-dark block w-full text-center"
      />
    </form>
  );
};

export default LoginForm;
