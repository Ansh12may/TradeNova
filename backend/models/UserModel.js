//A schema describes the structure of a MongoDB document.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
  name: 
  { type: String,
    required: true,
    trim:true 
  },

  email: 
  { type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: 
  { type: String,
    required: true
   },

   avatar:{
    type: String,
    default: null,

   },

   provider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },

     providerId: {
      type: String,
      default: null,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

},{timestamp:true});

const User = mongoose.model("user",userSchema);
module.exports = User;
