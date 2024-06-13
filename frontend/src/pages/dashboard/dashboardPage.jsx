import React, { useState, useEffect } from "react";
import ButtonComponent from "../../components/button/button";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "../../components/TextField/textFieldInput";

// Import API functions
import { fetchUserData, updateUserProfile,changePassword, Logout } from "../../service/apiUserConnect"; // Import API functions


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
    const token = sessionStorage.getItem("token");
    if (token) {
      sessionStorage.removeItem("token");
      Logout(token)
        .then(() => {
          Swal.fire({
            title: "Logout Successful!",
            text: "You have been logged out.",
            icon: "success",
          }).then(() => {
            navigate("/login");
          });
        })
        .catch((error) => {
          console.error('Error during logout:', error);
          Swal.fire({
            title: "Error!",
            text: "Failed to logout.",
            icon: "error",
          });
        });
    } else {
      console.error('Token not found in sessionStorage');
      Swal.fire({
        title: "Error!",
        text: "Failed to logout. Token not found.",
        icon: "error",
      });
    }
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

  // Change password function api changePassword save and cancel
  const onChangePassword = () => {
    Swal.fire({
      title: "Change Password",
      html: `
        <input id="oldPassword" class="swal2-input" placeholder="Old Password" type="password">
        <input id="newPassword" class="swal2-input" placeholder="New Password" type="password">
        <input id="confirmPassword" class="swal2-input" placeholder="Confirm Password" type="password">
      `,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => {
        const oldPassword = Swal.getPopup().querySelector("#oldPassword").value;
        const newPassword = Swal.getPopup().querySelector("#newPassword").value;
        const confirmPassword = Swal.getPopup().querySelector("#confirmPassword").value;

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage("Passwords do not match");
        }

        return { oldPassword, newPassword };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const token = sessionStorage.getItem("token");
        if (token) {
          const { oldPassword, newPassword } = result.value;
          changePassword(token, oldPassword, newPassword)
            .then(() => {
              Swal.fire({
                title: "Password Changed!",
                text: "Your password has been changed successfully.",
                icon: "success",
              });
            })
            .catch((error) => {
              console.error("Error changing password", error);
              Swal.fire({
                title: "Error!",
                text: "Failed to change password.",
                icon: "error",
              });
            });
        }
      }
    });
  }

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
          <ButtonComponent label={"Change Password"} onClick={onChangePassword} />
          <ButtonComponent label={"Logout"} onClick={onClickLogout} />
        </CardContent>
      </Card>
    </div>
  );
}
