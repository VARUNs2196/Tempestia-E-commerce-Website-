import React from "react";
import "../css/ProductCard.css";
import { useTheme } from "../components/ThemeContext"; // import theme context

const ProductCard = ({ product }) => {
  const { darkMode } = useTheme(); // get dark mode state

  return (
    <div className={`product-card ${darkMode ? "dark" : ""}`}>
      <img
        src={product.image}
        alt={product.title}
        className="product-image"
      />
      <div className="product-details">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">${product.price}</p>
        <p className="product-category">{product.category}</p>
        <button className="product-button">View Product</button>
      </div>
    </div>
  );
};

export default ProductCard;
