import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }, [])
  
  return (
    <></>
  )
};

export default HomePage;
