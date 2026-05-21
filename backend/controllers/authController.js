import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate Token Utility
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'nv_vogue_super_secret_jwt_key_987654_production_grade', {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        addresses: user.addresses,
        wishlist: user.wishlist,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        addresses: [],
        wishlist: [],
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data provided');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        addresses: user.addresses,
        wishlist: user.wishlist,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        addresses: updatedUser.addresses,
        wishlist: updatedUser.wishlist,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

// @desc    Add shipping address
// @route   POST /api/auth/addresses
// @access  Private
export const addAddress = async (req, res) => {
  try {
    const { street, city, state, postalCode, country, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      if (isDefault) {
        user.addresses.forEach((addr) => {
          addr.isDefault = false;
        });
      }

      user.addresses.push({
        street,
        city,
        state,
        postalCode,
        country,
        isDefault: isDefault || user.addresses.length === 0,
      });

      const updatedUser = await user.save();
      res.status(201).json(updatedUser.addresses);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

// @desc    Delete shipping address
// @route   DELETE /api/auth/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.addresses = user.addresses.filter((addr) => addr._id.toString() !== req.params.id);
      
      // If default address was deleted, make another one default
      if (user.addresses.length > 0 && !user.addresses.some((addr) => addr.isDefault)) {
        user.addresses[0].isDefault = true;
      }

      const updatedUser = await user.save();
      res.json(updatedUser.addresses);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

// @desc    Toggle wishlist item
// @route   POST /api/auth/wishlist
// @access  Private
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      const alreadyAdded = user.wishlist.includes(productId);

      if (alreadyAdded) {
        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
      } else {
        user.wishlist.push(productId);
      }

      const updatedUser = await user.save();
      await updatedUser.populate('wishlist');
      res.json(updatedUser.wishlist);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};
