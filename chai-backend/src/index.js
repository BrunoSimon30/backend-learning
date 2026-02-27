import "./config/loadenv.js";
import { PORT } from "./constants.js";
import mongooseConnection from "./db/mongoose.connection.js";
import { app } from "./app.js";
 
mongooseConnection()
.then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
})
.catch((err)=>{
    console.log("Error in connecting to MongoDB", err);
   
})