import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

// Your firebase configuration
import environment from './environments/environment'; 


firebase.initializeApp(environment.firebase);
const database = firebase.database();


const Container = styled(Box)({
  width: '90%',
  maxWidth: 400,
  margin: '0 auto',
  textAlign: 'center',
  padding: 110,
  borderRadius: 5,

  '@media only screen and (max-width: 768px)': {
    padding: 10,
  },
});

const Logo = styled('div')({
  marginBottom: 20,
});

const LogoImage = styled('img')({
  borderRadius: '50%',
  maxWidth: '100%',
});

const InputGroup = styled('div')({
  marginBottom: 20,
});

const StyledButton = styled(Button)({
  padding: '12px 24px',
  borderRadius: 5,
  fontSize: 16,
  cursor: 'pointer',
  color: '#fff',
  backgroundColor: 'blueviolet',
  '&:hover': {
    backgroundColor: 'blueviolet',
  },
});

const ReactComponent = () => {
  const [countryCodes, setCountryCodes] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

   useEffect(() => {
    // Simulating the fetch call
    const fetchCountryCodes = async () => {
      try {
        const response = await fetch('https://naveenkumarans.github.io/CountryCodes/codes.json');
        const data = await response.json();
        if (data && data.countryCodes) {
          // Reordering the country codes array
          const reorderedCountryCodes = data.countryCodes.sort((a, b) => {
            if (a.name === 'India') {
              return -1;
            } else if (b.name === 'India') {
              return 1;
            } 
            return 0;
          });
          setCountryCodes(reorderedCountryCodes);
        }
      } catch (error) {
        console.error('Error fetching country codes:', error);
      }
    };
    fetchCountryCodes();
  }, []);


  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleCountryCodeChange = (event) => {
    setCountryCode(event.target.value);
  };

  const openWhatsApp = () => {
    if (phoneNumber && countryCode) {
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        const userChatsRef = database.ref('userChats');
        const newChatRef = userChatsRef.push();
        const now = new Date();
        const formattedTime = now.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const formattedDate = now.toDateString();
        newChatRef.set({
          phoneNumber: phoneNumber,
          countryCode: countryCode,
          time: formattedTime,
          date: formattedDate,
        });
        const url = `https://wa.me/${countryCode}${phoneNumber}`;
        window.open(url, '_blank');
        setPhoneNumber(''); // Reset phone number
        setCountryCode(''); // Reset country code
      }, 2000);
    } else {
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  

  return (
    <Container>
      <Logo>
        <LogoImage
          src="https://firebasestorage.googleapis.com/v0/b/portfolioimages-fdfbd.appspot.com/o/logos%2Fonline-chat-icon-7.jpg?alt=media&token=91e68ccd-0973-430e-9979-ed1aac2e1aea"
          alt="WhatsApp logo"
          style={{ height: '100px', width: '100px' }}
        />
        <br />
        <h1>WhatsApp Instant Chat</h1>
        <h4>Initiate a chat on WhatsApp without the need to save the contact</h4>
      </Logo>
      <InputGroup>
        <FormControl sx={{ width: '100%' }}>
          <InputLabel id="countryCode-label">Country Code</InputLabel>
          <Select
            labelId="countryCode-label"
            id="countryCode"
            label="Country Code"
            value={countryCode}
            onChange={handleCountryCodeChange}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              getContentAnchorEl: null,
              PaperProps: {
                style: {
                  maxHeight: 224,
                  width: 250,
                },
              },
            }}
            displayEmpty
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={(event) => {
                  const { value } = event.target;
                  setCountryCode(value);
                }}
                label="Country Code"
                variant="outlined"
              />
            )}
          >
            {countryCodes.map((country) => (
              <MenuItem key={country.dial_code} value={country.dial_code}>
                
                {country.name} ({country.dial_code})
  
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </InputGroup>
      <InputGroup>
        <FormControl sx={{ width: '100%' }}>
          <TextField
            id="outlined-basic"
            label="Phone Number"
            variant="outlined"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        </FormControl>
      </InputGroup>
      <StyledButton onClick={openWhatsApp}>Start Chat</StyledButton>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {phoneNumber ? 'You are about to be redirected to WhatsApp.' : 'Please enter a valid phone number.'}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default ReactComponent;