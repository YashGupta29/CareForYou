require("dotenv").config();
const express = require("express");
const path = require("path");
const sendMail = require("./mail/mail");
require("./db/conn");
const User = require("./models/SignUpModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname, "views")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.get("/users",(req,res)=>{
//     const users = [];
//     User.find({},function(err,data){
//         if(err)
//             console.log(err);
//         else{
//             // console.log(data[0]);
//             users.push(data[0]);
//             console.log(users);
//             res.send(users);
//             // res.send(data);
//             // return res.json(data);
//         }
//     });
//     return users;
// });

// app.post("/change-password",(req,res)=>{
//     const {token} = req.body;
//     const userDetails = jwt.verify(token,JWT_SECRET);

//     console.log(userDetails);
//     res.json({status : "ok"});
// });

app.post("/booking" ,async (req,res)=>{
  const { date,time,reason,username } = req.body;
    try {

      const newBooking = {
        date:date,
        time:time,
        reason:reason
      }
      const user = await User.findOne({username : username});
      user.bookings = user.bookings.concat({booking : newBooking});   
      const token = await user.generateAuthToken();
      await user.save();
      // console.log(newBooking);
      // console.log(user.bookings[0]);
      const result = await sendMail(
        user.name,
        user.email,
        "",
        "",
        "Booking Done Successfully",
        `User ${user.name} Has Done a booking`,
        `Bookings Details : 
                            Date : ${date}
                            Time : ${time}`,
        `Bookings Details : 
                            Name : ${user.name}
                            Reason : ${reason}
                            Date : ${date}
                            Time : ${time}`);


        console.log("Email sent successfully");
        return res.json({ status: "ok", data: token });
    } catch (error) {
      console.log(error.message);
      res.json({status:'error',error:'something went wrong'})
    }
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "views/dashboard/index.html"));
});

app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "views/signin.html"));
});

app.post("/signin", async (req, res) => {
  const { username, pass } = req.body;
  //   const user = await User.findOne({ username }).lean();

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ status: "error", error: "Inavalid Login Credentials" });
    }

    if (await bcrypt.compare(pass, user.pass)) {
      // const token = jwt.sign(
      //   {
      //     id: user._id,
      //     name: user.name,
      //     email: user.email,
      //     username: user.username,
      //   },
      //   JWT_SECRET
      // );
      //   console.log(user);
      const token = await user.generateAuthToken();

      res.cookie("jwt",token);  

      
    //   console.log(cookie);
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ status: "error", error: "Inavalid Login Credentials" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ status: "error", error: "Inavalid Login Credentials" });
  }
});
//     try {
//         const username = req.body.username;
//         const pass = req.body.pass;
//         console.log(`Username : ${username}   Password : ${pass}`);

//         const userCred = await User.findOne({username : username});
//         const passMatched = await bcrypt.compare(pass,userCred.pass);
//         if(passMatched){
//             res.status(201).redirect("/");
//         }
//         else{
//             console.log("alert not shown");
//             res.redirect("/signin");
//         }

//         // res.redirect("/signin");
//     } catch (error) {
//         console.log(error);
//         res.status(400);
//         // prompt("Invalid Login Credentials");
//         res.redirect("/signin");
//     }
// });

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views/signup.html"));
});

app.post("/signup", async (req, res) => {
  const { name, email, phone, username, pass: password, cpass } = req.body;
  const pass = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      name,
      email,
      phone,
      username,
      pass,
      cpass: pass,
    });

    const token = await newUser.generateAuthToken();
    res.cookie("jwt",token);
    console.log("User Created Successfullly");
    return res.json({ status: "ok", data: token });
  } catch (error) {
    // console.log(error.message);
    const duplicateKey = error.keyValue;
    for (var key in duplicateKey) {
      // console.log(key);
      if (key === "username")
        return res.json({ status: "error", error: "Username already taken" });
      else if (key === "email")
        return res.json({ status: "error", error: "Email already registered" });
      else if (key === "phone")
        return res.json({
          status: "error",
          error: "Phone Number already used",
        });
    }
  }
});

// try {
//     const pass = req.body.pass;
//     const cpass =  req.body.cpass;
//     const hashedPass = await bcrypt.hash(pass,10);
//     const email = req.body.email;
//     const phone = req.body.number;
//     const username = req.body.username;

//     // const userEmail = User.findOne({email : email});
//     // const userPhone = User.findOne({phone : phone});
//     // const userUsername = User.findOne({username : username});
//     // console.log(userEmail);
//     // console.log(userPhone);
//     // console.log(userUsername);
//     // if(email === userEmail){
//     //     res.send("Email already used");
//     // }
//     // else if(phone === userPhone){
//     //     res.send("Phone already used");
//     // }
//     // else if(username === userUsername){
//     //     res.send("Username already used");
//     // }
//     // else{
//         const addUser = new User({
//             name : req.body.name,
//             email : email,
//             phone : phone,
//             username : username,
//             pass : hashedPass,
//             cpass : hashedPass
//         });
//         const userAdded = await addUser.save();
//         console.log(`Username : ${req.body.username}   Password : ${pass}`);
//         console.log(userAdded);
//         res.status(201).redirect("/");
//     // }
// } catch (error) {
//     // console.log(error.keyValue);
//     const duplicateKey = error.keyValue;
//     for(var key in duplicateKey){
//         console.log(key);
//         if(key === "username")
//         res.write('<script>alert("Usernaame already taken");</script>');
//         else if(key === "email")
//         res.write('<script>alert("Email already registered");</script>');
//         else if(key === "phone")
//         res.write('<script>alert("Phone Number already used");</script>');
//     }

//     res.status(400).redirect("/signup");
// }

app.post("/contact",async (req, res) => {
    // console.log(req.body);
    try {
      const result = await sendMail(
        req.body.name,
        req.body.email,
        req.body.subject,
        req.body.message,
        "Thank You",
        "User Contacted",
        "We received your details. We will contact you soon.",
        `User Details: 
                      Name:  ${req.body.name} 
                      Email:  ${req.body.email} 
                      Subject:  ${req.body.subject}
                      Message:  ${req.body.message}`);
      // console.log(result); 
      res.redirect("/");
    } catch (error) {
      res.json({status:'error',error:error.message});
    }
     
});

app.post("/contact2",async (req, res) => {
  // console.log(req.body);
  try {
    const result = await sendMail(
      req.body.name,
      req.body.email,
      req.body.subject,
      req.body.message,
      "Thank You",
      "User Contacted",
      "We received your details. We will contact you soon.",
      `User Details: 
                    Name:  ${req.body.name} 
                    Email:  ${req.body.email} 
                    Subject:  ${req.body.subject}
                    Message:  ${req.body.message}`);
    // console.log(result); 
    res.redirect("index2.html");
  } catch (error) {
    res.json({status:'error',error:error.message});
  }
   
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});




app.listen(port, () => {
  console.log(`Connection Successful at port ${port} `);
});
