const userController = (req,res)=>{
    res.send(req.randomNumber.toString());
};

export {userController};