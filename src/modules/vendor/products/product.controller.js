import {
  addProductService,
  updateProductService,
  deleteProductService,
  //updateInventoryService,
  getVendorProductsService,
  //estockProductService,
} from "./product.service.js";

// ADD PRODUCT
export const addProduct = async (req, res) => {
  try {

    const vendorId = req.user.vendorId; // vendor → comes from req.user.vendorId → not sent by frontend
     // req.files
    //images → come from req.files → Cloudinary → stored in schema
    const product = await addProductService(req.body, req.files, vendorId);
    //req.body 
    // should be explained in schema 
//     {
//   "name": "Men Cotton Casual Shirt",
//   "description": "Premium quality cotton shirt suitable for daily wear",
//   "price": 1299,
//   "quantity": 50,
//   "category": "Clothing",
//   "subcategory": "Men Shirts",
//   "brand": "UrbanStyle",
//   "sizes": ["S", "M", "L", "XL"],
//   "colors": ["Blue", "White"],
//   "discount": 10,
//   "status": "active"
// }
    
    
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE FULL PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;

    const product = await updateProductService(
      req.params.id,
      req.body,
      vendorId
    );

    res.json({ success: true, message: "Product updated", data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;

    await deleteProductService(req.params.id, vendorId);

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// // UPDATE PRICE / STOCK
// export const updateInventory = async (req, res) => {
//   try {
//     const vendorId = req.user.vendorId;

//     const product = await updateInventoryService(
//       req.params.id,
//       req.body,
//       vendorId
//     );

//     res.json({
//       success: true,
//       message: "Inventory updated",
//       data: product,
//     });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// GET ALL PRODUCTS OF VENDOR
export const getVendorProducts = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;

    const products = await getVendorProductsService(vendorId);

    res.json({ success: true, data: products });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
// //restoke
// export const restockProduct = async (req, res) => {
//   try {

//     const vendorId = req.user.vendorId;

//     const { quantity } = req.body;

//     const product = await restockProductService(
//       req.params.id,
//       vendorId,
//       quantity
//     );

//     res.json({
//       success: true,
//       message: "Stock updated successfully",
//       data: product
//     });

//   } catch (err) {

//     res.status(400).json({
//       success: false,
//       message: err.message
//     });

//   }
// };