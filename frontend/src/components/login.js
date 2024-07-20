import React, { useState } from 'react';
import image from "../static/wastebotai.jpg";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = 'http://localhost:8000';

export default function Login() {
    const navigate = useNavigate();
    const [Data, setData] = useState({
      email: "",
      password: ""
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        const response = await fetch(BASE_URL + "/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: Data.email,  // Assuming email is used as the username
            password: Data.password,
            grant_type: "password",
            scope: "offline_access",
          }),
        });
  
        const json = await response.json();
  
        if (response.ok) {
          localStorage.setItem("token", json.access_token);
          navigate('/User', { replace: true });
        } else {
          alert("Invalid Credentials");
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    };
  
    const handleChange = ({ currentTarget: input }) => {
      setData({ ...Data, [input.name]: input.value });
    };

  return (
    <>
      {/* Your existing JSX code remains unchanged */}
      {/* ... */}

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* ... */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log in
            </button>
            <Link to="/Signup">
              <div className="text-sm font-medium leading-6 text-gray-600 pt-3 flex justify-center hover:text-gray-800 hover:text-base">New here? Register for an account</div>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
