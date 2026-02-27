import { randomUsername } from "../utils/random.username.js";

const HomeController = (req,res)=>{
   const username = randomUsername();
    
    res.render("index", { username });
};

export {HomeController};