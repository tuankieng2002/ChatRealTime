const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,//dùng để chuyển đổi chuỗi thành chữ thường
      //unique: true,//dùng để đảm bảo rằng các giá trị trong cột là duy nhất
      default: "",
    },
    password: {
      type: String,
      required: [true, "Password your name"],
      trim: true,
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    address: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },

    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },

    verified: {
      type: Boolean,
      default: false,
    },
    otp: Number,
    otp_expiry: Date,
    resetPasswordOtp: Number,
    resetPasswordOtpExpiry: Date,
  },
  {
    timestamps: true,
  }
);

/*-----FUNCTION-----*/

// userSchema.statics.getUsers = async function () {
//   let user = await th;
//   return user;
// };

/*-----CLOSE FUNCTION-----*/

userSchema.pre('save', async function (next) {
  try{
    console.log(`Called before saving user`, this.phone, this.password);
  }catch(err){
    next(err);
  }
})

const User = mongoose.model("Users", userSchema);

module.exports = User;
