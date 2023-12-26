// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AddCategoryForm from './Components/Admin_Form_Category';
import AddProductForm from './Components/Admin_Form_Product';
import VerticalNavbar from './Components/Admin_navbar';
import Home from './Components/Home';
import Slider from './Components/Slider';
import Inventory from './Components/Inventory';
import Promocode from './Components/Promocode';
import CustomerManag from './Components/CustomerManag';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <VerticalNavbar />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/addProduct" component={AddProductForm} />
            <Route path="/addCategory" component={AddCategoryForm} />
            <Route path="/slider" component={Slider} />
            <Route path="/inventory" component={Inventory} />
            <Route path="/promocode" component={Promocode} />
            <Route path="/customerManagement" component={CustomerManag} />
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
