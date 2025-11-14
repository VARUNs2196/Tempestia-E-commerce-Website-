import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard"; // Import ProductCard component
import Navbar from "../components/Navbar";
import { useTheme } from "../components/ThemeContext"; // Import theme context

const UserDashboard = ({ isLoggedIn, onLogoutClick }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null); // New
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = selectedCategory
          ? `https://fakestoreapi.com/products/category/${encodeURIComponent(selectedCategory)}`
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
  }, [selectedCategory]); // re-fetch on category change

  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // Trigger fetch with new category
  };

  // Handle Add to Cart action
  const handleAddToCart = (productId) => {
    console.log(`Product ${productId} added to cart`);
    // Logic to add the product to the cart (can be enhanced to use context or local storage)
  };

  // Handle Add to Wishlist action
  const handleAddToWishlist = (productId) => {
    console.log(`Product ${productId} added to wishlist`);
    // Logic to add the product to the wishlist (can be enhanced to use context or local storage)
  };

  // Navigate to login if needed
  const handleShopNowClick = () => {
    navigate("/login");
  };

  return (
    <div className={`landing-page ${darkMode ? "dark" : "light"}`}>
      <Navbar isLoggedIn={isLoggedIn} onLogoutClick={onLogoutClick} onCategorySelect={handleCategorySelect} />

      <section className="welcome-section">
        <h2 className="welcome-title">Welcome to Tempestia</h2>
        <p className="welcome-text">Style That Moves You</p>
        <button className="shop-now-button" onClick={handleShopNowClick}>
          Shop Now
        </button>
      </section>

      <section className="featured-products-section">
        <h3 className="featured-products-title">
          {selectedCategory
            ? `Category: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`
            : "Featured Products"}
        </h3>

        {loading ? (
          <p className="loading-text">Loading products...</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product.id)}
                onAddToWishlist={() => handleAddToWishlist(product.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
export default UserDashboard;
