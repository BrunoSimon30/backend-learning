import productModel from "../models/product.model.js";
 

const createProduct = async (req, res)=>{
    try{
        const { name, description, price } = req.body;
        const imagePath = req.file ? "/uploads/" + req.file.filename : undefined;
        const product = await productModel.create({
            name,
            description,
            price,
            seller: req.user._id,
            ...(imagePath && { images: imagePath }),
        });

        res.status(200).json({ message: "Product created successfully", product ,image: req.file.path ,success: true});
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ message: "Internal server error", success: false});
    }
}

const getProducts = async (req, res)=>{
    try{
        const products = await productModel.find({});
        res.status(200).json({ message: "Products fetched successfully", products ,success: true});
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ message: "Internal server error", success: false});
    }
}

const getProductById = async (req, res)=>{
    try{
        const product = await productModel.findById(req.params.id);
        res.status(200).json({ message: "Product fetched successfully", product ,success: true});
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ message: "Internal server error", success: false});
    }
}

export { createProduct , getProducts,getProductById};