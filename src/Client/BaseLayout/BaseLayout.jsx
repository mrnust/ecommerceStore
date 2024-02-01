import React, { useEffect, useState } from "react";
import Benefit from "../Benefit";
import Advertisement from "../Advertisemet";
import Slider from "../Slider";
import CategoryBanner from "../CategoryBanner";
import "aos/dist/aos.css";
import { v4 as uuidv4 } from "uuid";
import { database } from "../../firebaseconfig";
import { ref, off, get, onValue } from "firebase/database";
import {getStorage, getDownloadURL, ref as storageRef } from "firebase/storage";
import ProductCard from "../ProductCard";
import TopNavBar from '../TopNavBar';
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer";
import { useLocation } from 'react-router-dom';


const BaseLayout = (props) => {
  const [userStatus, setUserStatus] = useState("GUEST");
  const [userID, setUserID] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!(localStorage.USERID && localStorage.USERSTATUS)) {
      const user = uuidv4();
      localStorage.setItem("USERID", user);
      localStorage.setItem("USERSTATUS", "GUEST");
      setUserID(user);
    }

    let status = "";
    if (localStorage.USERSTATUS) {
      status = localStorage.USERSTATUS;
      setUserStatus(status);
    }
    if (status === "LOGGED_IN") {
      const fetchRecommendations = async () => {
        try {
          const user = localStorage.USERID;
          setUserID(user);
          const recommendationsRef = ref(database, `Recommendations/${user}`);
          const snapshot = await get(recommendationsRef);
      
          if (snapshot.exists()) {
            // console.log("recs exist")
            const data = snapshot.val();
            console.log("rec data",data)
            const productIDs = Object.values(data);
            
            setRecommendations(productIDs);
            console.log(recommendations)
          } else {
            setRecommendations([]);
          }

          const productDetails = [];

          for (const productID of recommendations) {
            const productRef = ref(database, `Products/${productID}`);
            const productSnapshot = await get(productRef);
            const productData = productSnapshot.val();
            console.log("pro data",productData)
            const imagesRef = ref(database, `Images/Products/${productID}`);
            const imagesSnapshot = await get(imagesRef);
      
            if (imagesSnapshot.exists()) {
              console.log("recs exist")
              const storage = getStorage();
              console.log("recs exist")
              const imagesData = imagesSnapshot.val();
              const imageURLs = [];

              for (const imageName of Object.values(imagesData)) {
                try {
                  const imageUrl = await getDownloadURL(storageRef(storage, imageName));
                  imageURLs.push(imageUrl);
                
                } catch (error) {
                  console.error("Error fetching image:", error);
                }
              }
              console.log("image urls",imageURLs)

              productData.imageURLs = imageURLs.length > 0 ? imageURLs : null;
            }
            
            productDetails.push(productData);

            
            // Introduce a delay of 500 milliseconds between image downloads
            await new Promise((resolve) => setTimeout(resolve, 500));
          }

          setProducts(productDetails);
          console.log(products)
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      };
      
      fetchRecommendations();
    }
  }, []);
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
    <div className="layout-Container">
      {/* <NavBar/> */}
        
      <Slider />
      <CategoryBanner />
      {/* data-aos="fade-up" */}
      {userStatus === "LOGGED_IN" && (
        <div>
          <div 
            style={{
              display: "flex",
              marginTop: "10vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h2 style={{
            fontSize: "6vw", // Using viewport width unit for responsive font size
            // Add any other styles as needed
          }}>RECOMMENDATIONS!</h2>
          </div>
          {/* data-aos="fade-up" */}
          <div 
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: "5vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />  
            ))}
          </div>
        </div>
      )}
      <Benefit />
      <Advertisement />
      <Footer/>
      </div>
      </>
  );
};

export default BaseLayout;