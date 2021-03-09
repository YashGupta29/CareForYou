const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// const JWT_SECRET =
//   "kjsdafkaknsksfaldfdoampc*!^^#@^(*#)!@#@&)#&)!uoasfcoodafachdgbhdfhjfmfgbvdsvvvy9auoicfmo^@$*@$*!*$^@*!cahojoadhkasjhf ";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  pass: {
    type: String,
    required: true,
  },
  cpass: {
    type: String,
    required: true,
  },
  tokens: [{
    token : {
        type : String,
        required : true
    }
  }],
  bookings:[{
    booking : {
      date : {
        type : Date,
        required : true
      },
      time : {
        type : String,
        required : true
      },
      reason : {
        type : String,
        required : true
      }
    }
  }]
});

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({
      _id: this._id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      username: this.username,
      bookings: this.bookings
    },process.env.JWT_SECRET);

    this.tokens = this.tokens.concat({token : token});   
    await this.save();
    // console.log(token);
    return token;
  } catch (error) {
      res.send("Error");
      console.log("Error",error.message);
  }
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
