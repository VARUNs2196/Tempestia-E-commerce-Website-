import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../components/ThemeContext";
import "../css/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      const { token, user } = response.data;
      login(user, token);
      // navigate("/user");
      if (user.role === "admin") {
        navigate("/admin");
      } 
      else if(user.role==="vendor"){
        navigate("/vendor")
      }
      else {
        navigate("/user");
      }
      
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className={`login-container ${darkMode ? "dark" : "light"}`}>
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue to Tempestia</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <div className="login-footer">
            <p>
              <a href="/forgot-password">Forgot Password?</a>
            </p>
            <p>
              New to Tempestia? <a href="/register">Create an account</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
