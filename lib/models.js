import mongoose from 'mongoose'

const MenuItemSchema = new mongoose.Schema({
  vendorId: String,
  name: String,
  price: Number,
  description: String,
  isAvailable: { type: Boolean, default: true },
  category: String,
})

const VendorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cuisine: String,
  logoUrl: String,
  isOpen: { type: Boolean, default: false },
  currentLocation: {
    lat: Number,
    lng: Number,
    address: String,
    updatedAt: Date,
  },
  createdAt: { type: Date, default: Date.now },
})

const OrderSchema = new mongoose.Schema({
  vendorId: String,
  customerName: String,
  customerPhone: String,
  rating: Number,
  comment: String,
  items: [{ name: String, price: Number, qty: Number }],
  total: Number,
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'collected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
})

export const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema)
export const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema)
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)