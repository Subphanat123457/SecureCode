import React from 'react'
import Button from '@mui/material/Button';

const ButtonComponent = ({ label, onClick }) => {
    return (
        // variant="contained"
        <Button onClick={onClick} disableElevation>
          {label}
        </Button>
    );
}

export default ButtonComponent;
