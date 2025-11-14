import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get the dynamic URL params
import API from "../api/api";
import ProductCard from "../components/ProductCard";
import "../css/vendorStore.css";

const VendorStore = () => {
  const { vendorId } = useParams(); // Fetch vendorId from URL params
  const [storeName, setStoreName] = useState("Store"); // Default to "Store"
  const [editMode, setEditMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const fetchStoreData = async () => {
    try {
      const res = await API.get(`/vendor/store/${vendorId}`); // Use vendorId to fetch data
      setStoreName(res.data.storeName || "Store"); // Set the store name or default to "Store"
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, [vendorId]); // Fetch data whenever vendorId changes

  const handleSaveStoreName = async () => {
    try {
      await API.put("/vendor/store-name", { storeName });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating store name:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await API.post("/vendor/products", newProduct);
      setNewProduct({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
      });
      setShowDialog(false);
      fetchStoreData();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await API.put(`/vendor/products/${editingProductId}`, newProduct);
      setIsEditing(false);
      setNewProduct({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
      });
      setShowDialog(false);
      fetchStoreData();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await API.delete(`/vendor/products/${id}`);
      fetchStoreData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="vendor-store-container">
      {/* Store Name */}
      <div className="store-name-section">
        {editMode ? (
          <input
            className="store-name-input"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            onBlur={handleSaveStoreName}
            autoFocus
          />
        ) : (
          <h2
            className="store-name-heading"
            onClick={() => setEditMode(true)}
            title="Click to edit"
          >
            {storeName}
          </h2>
        )}
      </div>

      {/* Products Header */}
      <div className="product-header">
        <h3>Products</h3>
        <button
          className="button add-product-btn"
          onClick={() => {
            setShowDialog(true);
            setIsEditing(false);
            setNewProduct({
              name: "",
              price: "",
              description: "",
              image: "",
              category: "",
            });
          }}
        >
          + Add Product
        </button>
      </div>

      {/* Add/Edit Product Dialog */}
      {showDialog && (
        <div className="dialog">
          <div className="dialog-content">
            <input
              className="input"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />
            <textarea
              className="input"
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
            <div className="dialog-buttons">
              {isEditing ? (
                <button className="button" onClick={handleUpdateProduct}>
                  Update Product
                </button>
              ) : (
                <button className="button" onClick={handleAddProduct}>
                  Add Product
                </button>
              )}
              <button
                className="button outline"
                onClick={() => setShowDialog(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="product-grid">
        {products.length === 0 ? (
          <p style={{ textAlign: "center" }}>No products yet.</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default VendorStore;
