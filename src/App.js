// App.js
import React, { useState } from 'react';
import AddCategoryForm from './Components/Admin_Form_Category';
import AddProductForm from './Components/Admin_Form_Product';
import VerticalNavbar from './Components/Admin_navbar';
import Home from './Components/Home';
import Slider from './Components/Slider';

function App() {
  const [activeForm, setActiveForm] = useState('home'); // Set 'home' as the initial activeForm

  const handleSelectForm = (form) => {
    setActiveForm(form);
  };

  return (
    <div className="App">
      <header className="App-header">
        <VerticalNavbar onSelectForm={handleSelectForm} />
        {/* Render the form based on activeForm */}
        {activeForm === 'home' && <Home />}
        {activeForm === 'addProduct' && <AddProductForm />}
        {activeForm === 'addCategory' && <AddCategoryForm />}
        {activeForm === 'slider' && <Slider />}
      </header>
    </div>
  );
}

export default App;
