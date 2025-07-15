import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext";
import HeroSection from "./components/HeroSection";
import { LoginForm } from "./components/LoginForm";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login - in real app, you'd validate credentials
    login({ email: formData.email });
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* <HeroSection /> */}
      <LoginForm />
    </>
  );
}

export default Register;
