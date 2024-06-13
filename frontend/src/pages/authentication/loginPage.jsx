import React, { useState, useEffect } from "react";
import TextFieldInput from "../../components/TextField/textFieldInput";
import ButtonComponent from "../../components/button/button";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import { authenticateUser } from "../../service/apiUserConnect";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Handle username input change
  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  // Handle password input change
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }

  }, [navigate]);

  // Use `safeSetUser` instead of `setUser` directly
  const onClickLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await authenticateUser(username, password);
      if (token) {
        sessionStorage.setItem("token", token);
        Swal.fire({
          title: "Login Success!",
          text: "You clicked the button!",
          icon: "success",
        });
        navigate("/dashboard");
      } else {
        Swal.fire({
          title: "Login Failed",
          text: "Invalid username or password",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        title: "Login Error",
        text: "An error occurred during login",
        icon: "error",
      });
    }
  };

  // Handle register button click
  const onClickRegister = () => {
    navigate("/register"); // Navigate to register page
  };

  return (
    <div>
      <Card
        variant="outlined"
        style={{
          maxWidth: 400,
          margin: "auto",
          marginTop: 50,
          borderRadius: 15,
        }}
      >
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            SING IN
          </Typography>
          <TextFieldInput
            id="username"
            value={username}
            onChange={onChangeUsername}
            label={"Username"}
            type="text"
          />
          <TextFieldInput
            id="password"
            value={password}
            onChange={onChangePassword}
            label={"Password"}
            type="password"
          />
          {/* forgot password? */}
          <div style={{ textAlign: "right", fontSize: "14px" }}>
            <a href="/forgot-password">Forgot password?</a>
          </div>
         <ButtonComponent label="LOGIN" onClick={onClickLogin} />
          <br />
          <ButtonComponent label="REGISTER" onClick={onClickRegister} />
        </CardContent>
      </Card>
    </div>
  );
}
