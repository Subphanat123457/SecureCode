import React, { useState, useEffect } from "react";
import TextFieldInput from "../../components/TextField/textFieldInput";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../components/button/button";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';

// api
import { createUser } from "../../service/apiUserConnect";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password1, setPassword1] = useState("");

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const onChangePassword1 = (e) => {
        setPassword1(e.target.value);
    }

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
          navigate("/dashboard");
        }
      }, [navigate]);

    const onClickLogin = async () => {
        if (password !== password1 || password === "" || password1 === "") {
            Swal.fire({
                title: "Error!",
                text: "Password and Confirm Password do not match",
                icon: "error",
            });
            return;
        }
        try {
            await createUser(username, password);
            Swal.fire({
                title: "Success!",
                text: "Registration successful. You can now log in.",
                icon: "success",
            });
            navigate("/login");
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "An error occurred during registration",
                icon: "error",
            });
        }
    }

    const onClickBack = () => {
        navigate("/login");
    }

    return (
        <div>
            <Card variant="outlined" style={{ maxWidth: 400, margin: 'auto', marginTop: 50, borderRadius: 15 }}>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        Register Page
                    </Typography>
                    <TextFieldInput 
                        id="username" 
                        value={username}
                        onChange={onChangeUsername}
                        label={"Username"}
                        type='text'
                    />
                    <TextFieldInput 
                        id="password" 
                        value={password}
                        onChange={onChangePassword}
                        label={"Password"}
                        type='password'
                    />
                    <TextFieldInput 
                        id="password1" 
                        value={password1}
                        onChange={onChangePassword1}
                        label={"Confirm Password"}
                        type='password'
                    />
                    <ButtonComponent label="Sign Up" onClick={onClickLogin} />
                    <br />
                    <ButtonComponent label="Back to Login" onClick={onClickBack} />
                </CardContent>
            </Card>
        </div>
    );
}
