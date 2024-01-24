import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const ProductCard = ({product}) => {
    console.log(product);
  const [sliderArray, setSliderArray] = useState([]);
  const AddToLocalCart = (item) => {
    console.log("Add to cart:", item);
    let product = {
      productID: item.productID,
      // productImage:"",
      productImage: item.imageURLs[0],
      productName: item.productName,
      productPrice: item.productPrice,
      productCategory: item.productCategory,
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
      } else {
        //set in localStorage
        Cart.push(product);
        localStorage.setItem("SCLOCALCART", JSON.stringify(Cart));
      }
    } else {
      Cart.push(product);
      localStorage.setItem("SCLOCALCART", JSON.stringify(Cart));
    }
  };
  return (
    <div
      className="card"
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
          style={{ height: "280px" }}
          src={product.imageURLs[0]}
          className="card-img-top"
          alt={product.productName}
        />
      )}
      <div className="card-body">
        <h5 className="card-title">{product.productName}</h5>
        <p className="card-text">{product.productDescription}</p>
        <p className="card-text">$ {product.productPrice}</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
          <i
            style={{ float: "right", cursor: "pointer" }}
            id={product.productID}
            className="fas fa-shopping-bag"
            onClick={() => AddToLocalCart(product)}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;