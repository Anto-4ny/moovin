import React from 'react';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import { Fab, Tooltip, Zoom } from '@mui/material';

const SupportButton = () => {
  return (
    <Tooltip title="Need Help?" arrow>
      <Zoom in>
        <Fab
          color="primary"
          href="https://moovin-eight.vercel.app/contact.html"
          target="_blank"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1500,
            animation: 'bounce 1.5s infinite',
            backgroundColor: '#1976d2',
            color: '#fff'
          }}
        >
          <SupportAgentOutlinedIcon />
        </Fab>
      </Zoom>
    </Tooltip>
  );
};

export default SupportButton;
