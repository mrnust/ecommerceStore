// VerticalNavbar.js
import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { NavLink, useLocation } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import SliderIcon from '@mui/icons-material/Slideshow';
import InventoryIcon from '@mui/icons-material/Storage';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { color } from '@mui/system';


const drawerWidth = 200;

const VerticalNavbar = () => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const isTabActive = (tabPath) => {
    return location.pathname === tabPath;
  };

  return (
    <>
      <style>
        {`
          @keyframes orbitBorder {
            0% {
              transform: scale(1);
              box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.5);
            }
            25% {
              transform: scale(1.1);
              box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.7);
            }
            50% {
              transform: scale(1.2);
              box-shadow: 0 0 25px 10px rgba(255, 255, 255, 0.9);
            }
            75% {
              transform: scale(1.1);
              box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.7);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.5);
            }
          }

          .menuButton {
            position: absolute;
            top: 10px;
            left: 10px;
          }

          .toggleButton {
            margin-top: 10px;
            color: #ffffff;
            border: 1px solid #ffffff;
          }

          .drawerContainer {
            display: flex;
          }
        `}
      </style>
      <div className="drawerContainer">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
          className="menuButton"
          sx={{
            color: drawerOpen ? '' : '#000000',
            display: { sm: 'none' },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            display: { sm: 'block' },
          }}
          PaperProps={{
            sx: {
              width: drawerWidth,
              // backgroundColor: '#8E24AA',
              backgroundColor: '#db5246',
              overflowX: 'hidden',
            },
          }}
        >
          <List sx={{ paddingY: 0 }}>
            {[
              { to: '/admin', icon: <HomeIcon style={{ color: '#ffffff' }} />, label: 'Home' },
              { to: '/addProduct', icon: <AddBoxIcon style={{ color: '#ffffff' }} />, label: 'Add Product' },
              // { to: '/addCategory', icon: <CategoryIcon style={{ color: '#ffffff' }} />, label: 'Add Category' },
              { to: '/slider', icon: <SliderIcon style={{ color: '#ffffff' }} />, label: 'Slider' },
              { to: '/inventory', icon: <InventoryIcon style={{ color: '#ffffff' }} />, label: 'Inventory' },
              { to: '/promocode', icon: <LocalOfferIcon style={{ color: '#ffffff' }} />, label: 'Promo code' },
              { to: '/customerManagement', icon: <PersonIcon style={{ color: '#ffffff' }} />, label: 'Customer Management' },
            ].map(({ to, icon, label }, index) => (
              <ListItem
                key={index}
                button
                component={NavLink}
                to={to}
                exact={to === '/'}
                isActive={() => isTabActive(to)}
                sx={{
                  position: 'relative',
                  transition: 'transform 0.5s, box-shadow 0.5s',
                  animation: isTabActive(to) ? 'orbitBorder 5s linear infinite' : 'none',
                  '&:hover': {
                    transform: isTabActive(to) ? 'scale(1.2)' : 'scale(1.1)',
                    boxShadow: isTabActive(to)
                      ? '0 0 25px 10px rgba(255, 255, 255, 0.9)'
                      : '0 0 15px 5px rgba(255, 255, 255, 0.7)',
                  },
                  marginTop: '10px',
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} style={{ color: '#ffffff' }} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </div>
      <Button style={{backgroundColor:'black',color:'white',width:'100%', position: 'fixed', top: 0 }} className="toggleButton" onClick={toggleDrawer} fullWidth>
        {drawerOpen ? 'Hide Drawer' : 'Show Drawer'}
      </Button>
    </>
  );
};

export default VerticalNavbar;
