const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/CareForYouSignUp",{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex :true
}).then(()=>{
    console.log(`Connection Successful with Database`);
}).catch((e)=>{
    console.log("Error occcures",e);
})
 