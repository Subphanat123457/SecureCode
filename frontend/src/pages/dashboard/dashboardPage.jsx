import React, { useState, useEffect } from "react";
import ButtonComponent from "../../components/button/button";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "../../components/TextField/textFieldInput";

// Import API functions
import { fetchUserData, updateUserProfile } from "../../service/apiUserConnect"; // Import API functions

export default function DashboardPage() {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  //  Fetch user data
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      fetchUserData(token)
        .then((userData) => {
          setUsername(userData.username);
          setFirstname(userData.first_name);
          setLastname(userData.last_name);
          setEmail(userData.email);
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to fetch user data.",
            icon: "error",
          });
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Logout function
  const onClickLogout = () => {
    sessionStorage.removeItem("token");
    Swal.fire({
      title: "Logout Successful!",
      text: "You have been logged out.",
      icon: "success",
    }).then(() => {
      navigate("/login");
    });
  };

  // Update user profile
  const onSubmit = () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const userData = {
        username,
        first_name: firstname,
        last_name: lastname,
        email,
      };

      updateUserProfile(token, userData)
        .then(() => {
          Swal.fire({
            title: "Profile Updated!",
            text: "Your profile has been updated successfully.",
            icon: "success",
          });
        })
        .catch((error) => {
          console.error("Error updating profile", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to update profile.",
            icon: "error",
          });
        });
    }
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
          <div>Welcome: {username}</div>
          <TextField
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label={"Username"}
            type="text"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            label={"Firstname"}
            type="text"
          />
          <TextField
            id="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            label={"Lastname"}
            type="text"
          />
          <TextField
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label={"Email"}
            type="email"
          />
          <ButtonComponent label={"Edit Profile"} onClick={onSubmit} />
          <ButtonComponent label={"Logout"} onClick={onClickLogout} />
        </CardContent>
      </Card>
    </div>
  );
}
