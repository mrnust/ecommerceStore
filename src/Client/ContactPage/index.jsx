import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import emailjs from 'emailjs-com';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css'
import { useLocation } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import TopNavBar from '../TopNavBar';
import Footer from '../Footer'



const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  
  const [topHeaderClass, setTopHeaderClass] = useState("show");
  
   const handleScroll = () => {
    if (window.scrollY >= 50) {
      setTopHeaderClass("hide");
    } else {
      setTopHeaderClass("show");
    }
  };

   useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const location = useLocation();
  const hideHeader = ['/hide'];
  console.log(location.pathname)


const handleSubmit = (e) => {
  e.preventDefault();

  const serviceId = 'service_tg4x7gh';
  const templateId = 'template_vtajinx';
  const publickey = 'KSHUEq6hiBk5XDu4P';

  const templateParams = {
    from_name: name,
    from_email: email,
    message: message,  // Make sure to include the message
  };

  if (name == '' || email == '' || message == '') {
    toast.error(`Enter the credentials/Messge that is to be sent.`, { position: 'top-center', className: 'toast-error' });
    return;
  }

  emailjs.send(serviceId, templateId, templateParams, publickey)
    .then((response) => {
      console.log('Email sent successfully:', response);
      toast.success(`Message sent successfully..`, { position: 'top-center', className: 'toast-success' });
    })
    .catch((error) => {
      console.error('Email failed to send:', error);
      toast.error(`AN error has been occurred.`, { position: 'top-center', className: 'toast-error' });
    });
  setName('');
  setEmail('');
  setMessage('');

  // Example: You can send the form data to a server or perform any other action
  // e.target.reset();
};

  return (
    <>
      {
        !hideHeader.includes(location.pathname)
         && (
            <header className="header trans_300">
              {/* <TopNavBar className={topHeaderClass} /> */}
              <NavBar />
            </header>
          )}
      <div>
      <form id='yourFormId' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px',   boxShadow: '0 4px 8px grey', borderRadius: '8px', backgroundColor: '#ffffff', width: '60%', minHeight: '450px', maxWidth: '400px', margin: 'auto' ,marginTop:'80px'}}>
        <Typography style={{ color: 'hsl(26, 100%, 55%)', fontWeight: 'bold', marginBottom: '16px' }} variant="h5">
          Contact Us
        </Typography>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextareaAutosize
          aria-label="Enter Message"
          placeholder="Enter Message"
          rowsMin={6} // Increased the number of rows
          style={{ width: '100%', minHeight: '100px', padding: '10px', marginTop: '16px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: '20px', backgroundColor: 'hsl(26, 100%, 55%)' }}
        >
          Submit
        </Button>
      </form>

      {/* Rectangular Box */}
      <div className="contact-info" style={{ display: 'flex', backgroundColor: '#3E2723', padding: '5px',marginBottom:'10px', marginTop: '-20px', borderRadius: '8px', color: '#fff', width: '58%', marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="info-item" style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px' }}>
          <LocationOnIcon style={{ fontSize: '2rem', marginBottom: '8px' }} />
          <Typography style={{color:'white'}} variant="h6">Location</Typography>
          <Typography style={{fontSize:'1rem'}} variant="body1">123 Main Street</Typography>
          <Typography  style={{fontSize:'1rem'}} variant="body1">City, Country</Typography>
        </div>
        <div className="info-item" style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px' }}>
          <AccessTimeIcon style={{ fontSize: '2rem', marginBottom: '8px' }} />
          <Typography style={{color:'white'}} variant="h6">Hours</Typography>
          <Typography  style={{fontSize:'1rem'}} variant="body1">Weekdays: 9 AM - 6 PM</Typography>
          <Typography  style={{fontSize:'1rem'}} variant="body1">Saturday: 10 AM - 4 PM</Typography>
        </div>
        <div className="info-item" style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px' }}>
          <PhoneIcon style={{ fontSize: '2rem', marginBottom: '8px' }} />
          <Typography style={{color:'white'}} variant="h6">Call Us</Typography>
          <Typography  style={{fontSize:'1rem'}} variant="body1">+1 (123) 456-7890</Typography>
          <Typography  style={{fontSize:'1rem'}} variant="body1">+1 (987) 654-3210</Typography>
        </div>
        <ToastContainer position="top-center" autoClose={2000} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;

