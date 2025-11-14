import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";

import "../css/LandingPage.css";
import Navbar from "../components/Navbar";
import { useTheme } from "../components/ThemeContext"; // import theme context

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme(); // get dark mode state
  const navigate = useNavigate();
  const { type } = useParams(); // this gets the category name
  const decodedType = type ? decodeURIComponent(type) : null;
  const handleShopNowClick = () => {
    navigate('/login'); // change to the route you want to go to
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = decodedType
          ? `https://fakestoreapi.com/products/category/${decodedType}`
          : "https://fakestoreapi.com/products";
  
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [decodedType]);
  
  
  return (
    <div className={`landing-page ${darkMode ? "dark" : "light"}`}>
      <Navbar />

      <section className="welcome-section">
        <h2 className="welcome-title">Welcome to Tempestia</h2>
        <p className="welcome-text">Style That Moves You</p>
        <button className="shop-now-button" onClick={handleShopNowClick}>Shop Now</button>
      </section>

      <section className="featured-products-section">
  <h3 className="featured-products-title">Featured Products</h3>

  {decodedType && (
    <h3 className="featured-products-title">
      Category: {decodedType.charAt(0).toUpperCase() + decodedType.slice(1)}
    </h3>
  )}

  {loading ? (
    <p className="loading-text">Loading products...</p>
  ) : (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )}
</section>

    </div>
  );
};

export default LandingPage;
