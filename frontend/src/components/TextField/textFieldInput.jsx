import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export const TextFieldInput = ({ id, value, onChange, type, label, disabled }) => {
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id={id}
        value={value}
        onChange={onChange}
        type={type}
        label={label}
        variant="outlined"
        sx={{ 
          borderRadius: 50 
        }}
        disabled={disabled}
        required
      />
    </Box>
  );
};

export default TextFieldInput;
