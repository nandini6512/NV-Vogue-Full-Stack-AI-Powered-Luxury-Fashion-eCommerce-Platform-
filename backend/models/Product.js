import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 }, // Discount in percentage (e.g. 10 for 10% off)
    images: [{ type: String, required: true }],
    category: { type: String, required: true }, // e.g. "Men", "Women", "Kids", "Jeans", "Tops", "Beauty", "Shoes", "Accessories"
    sizes: [{ type: String }],
    colors: [{ type: String }],
    rating: { type: Number, required: true, default: 4.5 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    trending: { type: Boolean, default: false },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
