import React, { useEffect, useState } from "react";
import cart1 from '../../assets/images/icon-cart1.svg'
import previous from '../../assets/images/icon-previous.svg'
import next from '../../assets/images/icon-next.svg'
import minus from '../../assets/images/icon-minus.svg'
import plus from '../../assets/images/icon-plus.svg'
import Lightbox from '../LightBox';
import { useLocation } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import TopNavBar from '../TopNavBar';
import Footer from '../Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./style.css";
const ProductDetailsPage = (props) => {
  const { product } = props.location.state;
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [current, setCurrent] = useState(0);  
  const [curramount, setCurrAmount] = useState(0);
  const [topHeaderClass, setTopHeaderClass] = useState("show");

  console.log(product);
  
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
  
  const handlePlus = () => {
    if (quantity < product.productStock) {
      setCurrAmount(0);
      let prev = quantity;
      setQuantity(quantity + 1);
      setCurrAmount((quantity-prev) );
      
  } else {
    toast.warn(`Quantity cannot exceed ${product.productStock}`, { position: 'top-center', className: 'toast-warning' });
  }

  };
  const handleMinus = () => {
    if (quantity >0) {
      setCurrAmount(0);
      let prv = quantity;
      setQuantity(quantity - 1);
      setCurrAmount((prv-quantity));
  } else {
    toast.warn(`Quantity cannot be less than 0`, { position: 'top-center', className: 'toast-warning' });
  }
  };
  // const AddArray = product.imageURLs[0];
  const AddToCart = (item) => {
    setQuantity(0);
      let num = Number(localStorage.getItem('count'));
    // localStorage.setItem('count', num + 1);
    // const num= Number(localStorage.getItem('count'));
    localStorage.setItem('count', num + quantity)
    
      console.log("Add to cart:",item);
      if(quantity!==0){
        let newProduct = {
          productID: item.productID,
          productImage: item.imageURLs[0],
          productName: item.productName,
          productPrice: item.productPrice,
          productCategory: item.productCategory,
          productStock: item.productStock,
          productQuantity: quantity,
        };
        let Cart = [];
        if (localStorage.SCLOCALCART) {
          Cart = localStorage.SCLOCALCART;
          Cart = JSON.parse(Cart);
          let index = Cart.findIndex(
            (cartProduct) => cartProduct.productID === item.productID
          );
          if (index > -1) {
            // console.log('quantity: ' + Cart[index].productQuantity)
            Cart[index].productQuantity+=quantity;
            localStorage.setItem("SCLOCALCART", JSON.stringify(Cart));
            toast.success(`Added to cart..`, { position: 'top-center', className: 'toast-success' });
          } else {
            //set in localStorage
            Cart.push(newProduct);
            localStorage.setItem("SCLOCALCART", JSON.stringify(Cart));
            toast.success(`Added to cart..`, { position: 'top-center', className: 'toast-success' });
          }
        } else {
          Cart.push(newProduct);
          localStorage.setItem("SCLOCALCART", JSON.stringify(Cart));
          toast.success(`Added too cart..`, { position: 'top-center', className: 'toast-success' });
        }
      } 
    };

  const imageSlider = product.imageURLs.map((url, index) => {
    return {
      image:url,
    };
  });

  const thumbNail = product.imageURLs.map((url, index) => {
    return {
      id:index,
      image:url,
    };
  });
 
  //if we have no data, return null
  if (!Array.isArray(imageSlider) || imageSlider.length <= 0) {
    return null;
  }
  const length = imageSlider.length
  //checks if current is equal to length-1(3), if it is equal to that, it sets the image to index 0 else, it moves to the next image.
  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };
  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };


    
  


  return (
    //     <div className='hr'>
    //   <hr />
    // </div>
    <>
      {
        !hideHeader.includes(location.pathname)
         && (
            <header className="header trans_300">
              {/* <TopNavBar className={topHeaderClass} /> */}
              <NavBar />
            </header>
          )}
    <section className="grid6" style={{marginTop:"0.1vh"}}>
      <div>
        <div className="slider">
          {/* Code for rendering slider images */}
          {imageSlider.map((slide, index) => {
            return (
              <div
                className={index === current ? "slide active" : "slide"}
                key={index}
              >
                {index === current && (
                  <img
                    className="product1"
                    src={slide.image}
                    alt="product one"
                    onClick={() => setShow3(true)}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="thumbnail">
          {/* Code for rendering thumbnail images */}
          {thumbNail.map((item, key) => {
            return (
              <div className="imgs" key={key}>
                <img
                  className="thumbnailimg"
                  src={item.image}
                  alt="thumNail product images"
                  onClick={() =>
                    setCurrent(current === item.id ? current : item.id)
                  }
                />
                <Lightbox 
                  thumbNail={thumbNail}
                  imageSlider={imageSlider}
                  current={current}
                  setCurrent={setCurrent}
                  prevSlide={prevSlide}
                  nextSlide={nextSlide}
                  previous={previous}
                  next={next}
                  onClose={() => setShow3(false)}
                  show3={show3}
                />
              </div>
            );
          })}
        </div>
        <div className="prevnext">
          {/* Code for previous and next buttons */}
          <div>
            <img onClick={prevSlide} src={previous} alt="previous" />
          </div>
          <div>
            <img onClick={nextSlide} src={next} alt="next" />
          </div>
        </div>
      </div>
      <div className="texts">
        {/* Code for rendering textual information about the product */}
        <small>ZEPHYR</small>
        <p className="textsp">{product.productName}</p>
        <p className="textspp">
          These low profile snickers are your perfect casual wear companion.
          Featuring a durable rubber outer sole, they'll withstand everything
          the weather can offer.
          {/* {product.productDescription} */}
        </p>
        <section className="sec">
          <div className="numbers">
            <div className="numbers1">
              <p className="num">${product.productPrice}.00</p>
              {/* <div className="num1">
                <p>50%</p>
              </div> */}
            </div>
            {/* <div>
              <p className="num2">
                <strike>$250.00</strike>
              </p>
            </div> */}
          </div>
          <div className="flexx">
            <div className="addminus">
              <div>
                <img onClick={handleMinus} src={minus} alt="minus" />
              </div>
              <div>
                <small className="quantity">{quantity}</small>
              </div>
              <div>
                <img onClick={handlePlus} src={plus} alt="plus" />
              </div>
            </div>
            <div>
              <button
                onClose={() => setShow2(true)}
                onClick={()=>AddToCart(product)}
                className="button"
              >
                <div>
                  <img style={{marginTop:'2px'}} src={cart1} alt="cart" />
                </div>
                <div>
                  <p style={{color:'white'}}>Add to cart</p>
                </div>
              </button>
            </div>
          </div>
        </section>
        </div>
         <ToastContainer position="top-center" autoClose={2000} />
      </section>
      <Footer />
    </>
  );
};

export default ProductDetailsPage;
