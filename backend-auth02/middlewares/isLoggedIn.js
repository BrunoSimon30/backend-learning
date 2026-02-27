const isLoggedIn = (req,res,next)=>{
 console.log("isLoggedIn middleware");
 req.randomNumber = Math.random();
 next();
};

export {isLoggedIn};