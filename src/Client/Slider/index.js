import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import BackgroundImage1 from "../../assets/images/slider_1.jpg";
import BackgroundImage2 from "../../assets/images/slider_2.jpg";
import BackgroundImage3 from "../../assets/images/slider_3.jpg";
import { database } from "../../firebaseconfig";
import { onValue, ref, get, off } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

const Slider = (props) => {
  const [sliderArray, setSliderArray] = useState([]);

  useEffect(() => {
    setSliderArray([BackgroundImage1,BackgroundImage2,BackgroundImage3])
    // const imageRef = ref(database, "Images/Slider");

    // const handleData = async (snapshot) => {
    //   const data = snapshot.val();
    //   if (snapshot.exists()) {
    //     const imageUrls = await Promise.all(
    //       Object.values(data).map(async (imageName) => {
    //         const imageUrl = await getDownloadURL(
    //           storageRef(getStorage(), imageName)
    //         );
    //         return imageUrl;
    //       })
    //     );
    //     setSliderArray(imageUrls);
    //   } else {
    //     setSliderArray([]);
    //   }
    // };

    // onValue(imageRef, handleData);

    // return () => {
    //   off(imageRef, "value", handleData);
    // };
  }, []);
  return (
    <Carousel>
      {sliderArray.map((imageUrl, index) => (
        <Carousel.Item key={index}>
          <div
            className="d-block w-100 main_slider"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover", // Ensure the image covers the entire container
              backgroundPosition: "center", // Center the image
              height: "400px",
            }}
          >
            {/* <img
              key={index}
              src={imageUrl}
              style={{ width: "100%",height:"auto"}}
            /> */}
            {/* data-aos="fade-right" */}
            <div className="container fill_height">
              <div className="row align-items-center fill_height">
                <div className="col">
                  <div className="main_slider_content" >
                    <h6>Spring / Summer Collection 2024</h6>
                    <h1>Get up to 30% Off New Arrivals</h1>
                    <div className="red_button shop_now_button">
                      <a href="/" >shop now</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
    //   <Carousel>
    //     <Carousel.Item>
    //       <div
    //         className="d-block w-100 main_slider"
    //         style={{
    //           backgroundImage: `url(${BackgroundImage1})`,
    //         }}
    //       >
    //         <div className="container fill_height">
    //           <div className="row align-items-center fill_height">
    //             <div className="col">
    //               <div className="main_slider_content" data-aos="fade-right">
    //                 <h6>Spring / Summer Collection 2017</h6>
    //                 <h1>Get up to 30% Off New Arrivals</h1>
    //                 <div className="red_button shop_now_button">
    //                   <a href="#">shop now</a>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </Carousel.Item>
    //     <Carousel.Item>
    //       <div
    //         className="d-block w-100 main_slider"
    //         style={{
    //           backgroundImage: `url(${BackgroundImage2})`,
    //         }}
    //       >
    //         <div className="container fill_height">
    //           <div className="row align-items-center fill_height">
    //             <div className="col">
    //               <div className="main_slider_content" data-aos="fade-right">
    //                 <h6>Spring / Summer Collection 2017</h6>
    //                 <h1>Get up to 30% Off New Arrivals</h1>
    //                 <div className="red_button shop_now_button">
    //                   <a href="#">shop now</a>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </Carousel.Item>
    //     <Carousel.Item>
    //       <div
    //         className="d-block w-100 main_slider"
    //         style={{
    //           backgroundImage: `url(${BackgroundImage3})`,
    //         }}
    //       >
    //         <div className="container fill_height">
    //           <div className="row align-items-center fill_height">
    //             <div className="col">
    //               <div className="main_slider_content" data-aos="fade-right">
    //                 <h6>Spring / Summer Collection 2017</h6>
    //                 <h1>Get up to 30% Off New Arrivals</h1>
    //                 <div className="red_button shop_now_button">
    //                   <a href="#">shop now</a>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </Carousel.Item>
    //   </Carousel>
  );
};

export default Slider;
