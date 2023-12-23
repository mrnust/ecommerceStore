import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import SliderIcon from '@mui/icons-material/Slideshow'; // Import SliderIcon

const drawerWidth = 240;

const VerticalNavbar = ({ onSelectForm }) => {
  const handleItemClick = (form) => {
    onSelectForm(form);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      style={{
        width: drawerWidth,
        flexShrink: 0,
        backgroundColor: '#8E24AA', // Purple background color
      }}
      PaperProps={{ style: { width: drawerWidth, backgroundColor: '#8E24AA' } }}
    >
      <List>
        <ListItem button onClick={() => handleItemClick('home')}>
          <ListItemIcon>
            <HomeIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Home" style={{ color: '#ffffff' }} />
        </ListItem>
        <ListItem button onClick={() => handleItemClick('addProduct')}>
          <ListItemIcon>
            <AddBoxIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Add Product" style={{ color: '#ffffff' }} />
        </ListItem>
        <ListItem button onClick={() => handleItemClick('addCategory')}>
          <ListItemIcon>
            <CategoryIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Add Category" style={{ color: '#ffffff' }} />
        </ListItem>
        <ListItem button onClick={() => handleItemClick('slider')}>
          <ListItemIcon>
            <SliderIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Slider" style={{ color: '#ffffff' }} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default VerticalNavbar;
