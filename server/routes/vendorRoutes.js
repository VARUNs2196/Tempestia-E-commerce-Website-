const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const {
  getVendorStore,
  updateStoreName,
  getVendorProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getVendorAnalytics
} = require('../controllers/productController');


router.put('/store-name', protect, updateStoreName);

router.get('/products', protect, getVendorProducts);

router.post('/products', protect, addProduct);


router.put('/products/:id', protect, updateProduct);


router.delete('/products/:id', protect, deleteProduct);


router.get('/analytics', protect, getVendorAnalytics);

router.get('/stats', protect, getVendorAnalytics);
router.get('/store/:storeName', protect, getVendorStore);

module.exports = router;
