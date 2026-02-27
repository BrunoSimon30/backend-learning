import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
   products: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "Product",
    
   },
   buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
   },
   payment : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
   }
   
}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema);
export default Order;