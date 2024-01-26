import React, { useEffect, useState } from "react";
import "aos/dist/aos.css";

// import { storage } from "../../../firebaseconfig";
// import {
//   getStorage,
//   ref as storageRef,
//   getDownloadURL,
//   list,
// } from "firebase/storage";
import footwear from "../../assets/images/1.png";
import eyewear from "../../assets/images/2.png";
import bags from "../../assets/images/3.png";
import jewellery from "../../assets/images/4.png";
import aparrel from "../../assets/images/5.png";
import watches from "../../assets/images/7.png";
import { Link, useHistory } from "react-router-dom";

import { database } from "../../firebaseconfig";
import { onValue, ref, get, off } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

function CategoryBanner(props) {
  const history = useHistory();
  const categoryImages = [
    { categoryName: "APPAREL", imageUrl: aparrel },
    { categoryName: "BAGS", imageUrl: bags },
    { categoryName: "EYEWEAR", imageUrl: eyewear },
    { categoryName: "FOOTWEAR", imageUrl: footwear },
    { categoryName: "JEWELLERY", imageUrl: jewellery },
    { categoryName: "WATCHES", imageUrl: watches },
  ];
  console.log(categoryImages);
  const handleCategoryClick = (category) => {
    // history.push(/categories?category=${category});
    history.push({
      pathname: "/categories",
      state: { category },
    });
  };
  // const [categoryImages, setCategoryImages] = useState([]);

  // useEffect(() => {
  //   const imageRef = ref(database, "Images/Categories");
  //   const categoryArray=[];
  //   const handleData = async (snapshot) => {
  //     const data = snapshot.val();
  //     if (snapshot.exists()) {
  //       for (const [categoryName, imageName] of Object.entries(data)) {
  //         const imageUrl = await getDownloadURL(storageRef(getStorage(), imageName));
  //         categoryArray.push({ categoryName, imageUrl });}}
  //       setCategoryImages(categoryArray);
  //       console.log(categoryArray)
  //   };

  //   onValue(imageRef, handleData);

  //   return () => {
  //     off(imageRef, "value", handleData);
  //   };
  // }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <div  className="banner">
      <div style={{animationDelay:'2s'}} className="animate__animated animate__swing container" >
        <div className="row">
          {categoryImages.map((categoryImage, index) => (
            <div key={index} className="col-md-4" style={{ paddingTop: "2em" }}>
              <div
                className="banner_item align-items-center"
                style={{
                  backgroundImage:    `url(${categoryImage.imageUrl})`,
                  paddingBottom:"0.5em"
                }}
                // data-aos={`fade-${index % 2 === 0 ? "right" : "up"}`}
              >
                <div
                  onClick={() => {
                    handleCategoryClick(categoryImage.categoryName);
                  }}
                  className="banner_category"
                  style={{cursor:"pointer"}}
                >
                  <a>{categoryImage.categoryName}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryBanner;