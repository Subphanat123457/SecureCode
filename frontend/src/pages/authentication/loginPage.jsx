import React, { useState } from "react";
import TextFieldInput from "../../components/TextField/textFieldInput";
import ButtonComponent from "../../components/button/button";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import { authenticateUser } from "../../service/apiUserConnect";
import { useAuth } from "../../context/authContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onClickLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await authenticateUser(username, password);
      if (token) {
        setUser({ token });
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

  const onClickRegister = () => {
    navigate("/register");
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
            Login Page
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
          <ButtonComponent label="Login" onClick={onClickLogin} />
          <br />
          <ButtonComponent label="Register" onClick={onClickRegister} />
        </CardContent>
      </Card>
    </div>
  );
}
