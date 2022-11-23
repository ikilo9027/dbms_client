import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate(props) {
  const progressStyle = {
    display: props.isOpen ? 'flex' : 'none',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: 'auto',
    zIndex: '101'
  }
  return (
    <Box sx={progressStyle}>
      <CircularProgress />
    </Box>
  );
}