// VerticalNavbar.js
import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import AddBoxIcon from '@mui/icons-material/AddBox';
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import SliderIcon from '@mui/icons-material/Slideshow';
import InventoryIcon from '@mui/icons-material/Storage';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/system';

const drawerWidth = 200;

const VerticalNavbar = () => {
  const theme = useTheme();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={true}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`@media (max-width:${theme.breakpoints.values.md}px)`]: {
          width: drawerWidth,
        },
      }}
      PaperProps={{
        sx: {
          width: drawerWidth,
          backgroundColor: '#8E24AA',
          [`@media (max-width:${theme.breakpoints.values.md}px)`]: {
            width: drawerWidth,
          },
        },
      }}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <HomeIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Home" style={{ color: '#ffffff' }} />
        </ListItem>
        <ListItem button component={Link} to="/addProduct">
          <ListItemIcon>
            <AddBoxIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Add Product" style={{ color: '#ffffff' }} />
        </ListItem>
        <ListItem button component={Link} to="/addCategory">
          <ListItemIcon>
            <CategoryIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Add Category" style={{ color: '#ffffff' }} />
        </ListItem>
        <ListItem button component={Link} to="/slider">
          <ListItemIcon>
            <SliderIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Slider" style={{ color: '#ffffff' }} />
        </ListItem>
        <ListItem button component={Link} to="/inventory">
          <ListItemIcon>
            <InventoryIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Inventory" style={{ color: '#ffffff' }} />
        </ListItem>
        <ListItem button component={Link} to="/promocode">
          <ListItemIcon>
            <LocalOfferIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Promo code" style={{ color: '#ffffff' }} />
        </ListItem>
        <ListItem button component={Link} to="/customerManagement">
          <ListItemIcon>
             <PersonIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Customer Management" style={{ color: '#ffffff' }} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default VerticalNavbar;
