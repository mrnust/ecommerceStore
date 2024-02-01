import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database } from "../../firebaseconfig";
import { ref, off, get } from "firebase/database";
import {getStorage, getDownloadURL, ref as storageRef } from "firebase/storage";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import TopNavBar from '../TopNavBar';
import Footer from '../Footer'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { InputAdornment, IconButton,TextField } from '@mui/material';

import MicIcon from '@mui/icons-material/Mic';
import './CategoriesPage.css';
// import Input from "postcss/lib/input";

const CategoriesPage = (props) => {

  const { transcript, listening, resetTranscript, startListening, stopListening, onEnd } = useSpeechRecognition();
  
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = props.location.state;
  const [searchTerm,setSearchTerm]=useState("");
  const [searchArray, setSearchArray] = useState([]);
  


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









  //set items in Local Storage
  const AddToLocalCart = (item) => {
    let num = Number(localStorage.getItem('count'));
    localStorage.setItem('count', num + 1);
    console.log("Add to cart:", item);
    let product = {
      productID: item.productID,
      productImage: item.imageURLs[0],
      productName: item.productName,
      productPrice: item.productPrice,
      productCategory: item.productCategory,
      productStock: item.productStock,
      productQuantity: 1,
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
        Cart[index].productQuantity++;
        localStorage.setItem("SCLOCALCART", JSON.stringify(Cart));
        toast.success(`Added to cart..`, { position: 'top-center', className: 'toast-success' });
      } else {
        //set in localStorage
        Cart.push(product);
        localStorage.setItem("SCLOCALCART", JSON.stringify(Cart));
        toast.success(`Added to cart..`, { position: 'top-center', className: 'toast-success' });
      }
    } else {
      Cart.push(product);
      localStorage.setItem("SCLOCALCART", JSON.stringify(Cart));
      toast.success(`Added to cart..`, { position: 'top-center', className: 'toast-success' });
    }
  };

  useEffect(() => {
    console.log("Fetching data for category:", category);
    const fetchData = async () => {
      try {
        const productsRef = ref(database, "Products");
        const snapshot = await get(productsRef);

        const data = snapshot.val();
        if (data) {
          const products = Object.keys(data)
            .map((key) => ({ ...data[key] }))
            .filter((product) => product.productCategory === category);

          const productsWithImages = await Promise.all(
            products.map(async (product) => {
              const imagesRef = ref(
                database,
                `Images/Products/${product.productID}`
              );
              console.log("line 62:", product.productID);
              try {
                const imagesSnapshot = await get(imagesRef);
                console.log("line 65:", imagesSnapshot.val());
                if (imagesSnapshot) {
                  const storage = getStorage();
                  console.log("line 66: snapshot exists");
                  const imagesData = imagesSnapshot.val();
                  console.log(imagesData);
                  
                  const imageURLs = await Promise.all(
                    Object.values(imagesData).map(async (imageName) => {
                      const imageUrl = await getDownloadURL(
                        storageRef(storage, imageName)
                      );
                      return imageUrl;
                    })
                  );

                  return { ...product, imageURLs: imageURLs };
                } else {
                  // If no images are found, return the product without imageURLs
                  return product;
                }
              } catch (error) {
                // Handle errors that may occur during the asynchronous operations
                console.error("Error fetching images:", error);
                return product; // Return the product without imageURLs in case of an error
              }
            })
          );
          console.log(products);
          console.log(productsWithImages);
          setCategoryProducts(productsWithImages);
          setSearchArray(productsWithImages)
        } else {
          setCategoryProducts([]);
          setSearchArray([]);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
        // console.log("imgs array:"+productsWithImages);
      }
    };

    fetchData();

    return () => {
      off(ref(database, "Products"), "value");
    };
  }, [category]); // Ensure it only runs once when the component mounts

  //searchbar ftn
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term === '') {
      setSearchArray(categoryProducts);
      // setCategoryProducts(results);
    }
    const results = categoryProducts.filter(
      (product) =>
        product.productName.toLowerCase().includes(term.toLowerCase())
    );
    setSearchArray(results)
  };
const handleVoiceSearch = () => {
  if (listening) {
    SpeechRecognition.stopListening();
  } else {
    // Start listening and reset the transcript
    SpeechRecognition.startListening();
    resetTranscript();
  }
};

// Set up an effect to update searchTerm whenever transcript changes
useEffect(() => {
  setSearchArray(transcript);
}, [transcript]);
  
  
  // if (loading) {
  //   return <p>Loading...</p>;
  // }
  // if (error) {
  //   return <p>Error: {error.message}</p>;
  // }


  // spinner
 if (loading) {
    return (
      <div style={{display:'flex',justifyContent:'center',alignItems:'center'}} className="spinner-container">
        <CircularProgress color="primary" size={60} />
      </div>
    );
  }

  


  return (
    <div>
      {
        !hideHeader.includes(location.pathname)
         && (
            <header className="header trans_300">
              {/* <TopNavBar className={topHeaderClass} /> */}
              <NavBar />
            </header>
          )}
      <div
        style={{
          display: "flex",
          marginTop: "5vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>{category}</h1>
      </div>
      <div style={{textAlign:'center',padding:'5px', margin: "20px", width: "100%", marginTop: "60px" }}>
      <TextField 
          //  placeholder="Search by name"
          label="Search by name"
         variant="outlined"
         value={searchTerm}
         onChange={handleSearch}
          fullWidth
          style={{
          padding: '10px',
          fontSize: '16px',
          maxWidth: '400px', // Set a maximum width for larger screens
          margin: '0 auto', // Center the input on larger screens
          // Media query for adjusting styles on smaller screens
          '@media (max-width: 600px)': {
            width: '50%', // Make it full width on small screens
            maxWidth: '100%', // Remove max-width on small screens
             margin: '0 auto',
          },
         }}
          InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleVoiceSearch}>
                <MicIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
       />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: "5vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {searchArray.map((product) => (
          <div
            className={`card ${product.productStock === 0 ? 'out-of-stock' : ''}`}
            style={{ width: "18rem", margin: "10px" }}
            key={product.productID}
          >
            <img
              src={product.imageURL}
              className="card-img-top"
              alt={product.title}
            />
            {product.imageURLs && product.imageURLs.length > 0 && (
              <img
            style={{height:"280px"}}

                src={product.imageURLs[0]}
                className="card-img-top"
                alt={product.productName}
              />
            )}
            <div className="card-body">
              <h5 className="card-title">{product.productName}</h5>
              <p className="card-text">{product.productDescription}</p>
              <p className="card-text">$ {product.productPrice}</p>
               {product.productStock === 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-80%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#f00',
                    color: '#fff',
                    padding: '5px',
                    borderRadius: '5px',
                    zIndex: '1',
                    width: '100%',
                    height:'30%'
                  }}
                >
                  Out of Stock
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                 {product.productStock === 0 ? (
                  <button
                    className="btn btn-primary disabled"
                    style={{
                      backgroundColor: "#fe4c50",
                      border: "none",
                      float: "left",
                    }}
                    disabled
                  >
                    View Product
                  </button>
                ) : (
                  <Link
                    to={{
                      pathname: "/productDetailsPage",
                      state: { product: product },
                    }}
                    className="btn btn-primary"
                    style={{
                      backgroundColor: "#fe4c50",
                      border: "none",
                      float: "left",
                    }}
                  >
                    View Product
                  </Link>
                )}
                <i
                  style={{ float: "right", cursor: "pointer", opacity: product.productStock === 0 ? 0.5 : 1 }}
                  id={product.productID}
                  className={`fas fa-shopping-bag ${product.productStock === 0 ? 'disabled' : ''}`}
                  onClick={() => product.productStock > 0 && AddToLocalCart(product)}
                ></i>
              </div>
            </div>
          </div>
        ))}
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
