const getIndex = async (req, res, next)=>{
    try{
        res.status(200).json({ message: "Welcome to the API" });
    }
    catch(err){
        next(err.message);
    }
}

export { getIndex };