const httpStatus = require("http-status");
const userService = require("./user.service");
const jwt = require("jsonwebtoken");
const User = require("./user.model");
const sendMail = require("../utils/sendMail");

const bcrypt = require("bcrypt");

const { userValidate } = require("../helpers/validation");

//token
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../middleware/auth");

const client = require("../helpers/connections_redis");

//Register user
const createUser = async (req, res) => {
  try {
    //console.log(req.body);
    const { full_name, email, password, address, phone, avatar, role } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);//số 10 là số lần mã hóa password (số lần càng nhiều thì password càng an toàn) (số lần càng ít thì password càng nhanh)

    const { error } = userValidate(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // if(full_name == '' || email == '' || password == '' || address == '' || phone == '' || avatar == '' ){
    //   return res.status(httpStatus.BAD_REQUEST).json({
    //     status: httpStatus.BAD_REQUEST,
    //     message: "Not is empty",
    //     data: null,
    //   });
    // }

    const otp = Math.floor(Math.random() * 1000000);

    const user = await userService.createUser({
      full_name,
      email,
      password: hashPassword,
      address,
      phone,
      avatar: {
        public_id: "mycloud.public_id",
        url: "mycloud.secure_url",
      },
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),//otp_expiry là thời gian hết hạn của otp (otp_expiry: new Date(Date.now() + 5 * 60 * 1000) là 5 phút)
      role
    });

    //await sendMail(email, "Verify your account", `Your OTP is ${otp}`);

    // const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });//expiresIn dùng để đặt thời gian tồn tại của token (1d là 1 ngày)
    const accToken = await signAccessToken(user._id, user.role);
    const refToken = await signRefreshToken(user._id, user.role);

    //refreshToken
    // const refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1y" });//1y=1 năm

    res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      message: "OTP sent to your email, please verify your account",
      //data: user
      accessToken: accToken,
      refreshToken: refToken
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
      data: null,
    });
  }
};
// const createUser = async (req, res) => {
//   try {
//     console.log(req.body)
//     const user = await userService.createUser(req.body);
//     return res
//       .status(httpStatus.CREATED)
//       .json({ status: httpStatus.CREATED, message: "success", data: user });
//   } catch (error) {
//     console.log(error);
//     return res.status(httpStatus.BAD_REQUEST).json({
//       status: httpStatus.BAD_REQUEST,
//       message: error.message,
//       data: null,
//     });
//   }
// };

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    return res.status(httpStatus.OK).json({ status: httpStatus.OK, message: "Success", data: users });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
      data: null,
    });
  }
};

//Login phone hash password
const loginUser = async (req, res) => {
  try {
    const passwordd = req.body.password;
    const phone = req.body.phone;

    if (phone == '' || passwordd == '') {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Phone or password is empty",
        data: null,
      });
    }

    let user = await userService.loginUser({ phone: phone }, passwordd);//công dụng của select là để lấy password ra để so sánh với password người dùng nhập vào (password ở đây là password đã được mã hóa)  (select("+password") là để lấy password ra)  (select("-password") là để không lấy password ra)
    console.log(user);
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Phone number is not exist",
        data: null,
      });
    }

    const { password, otp, role, ...others } = user;//rest là để lấy tất cả các thuộc tính của user trừ password (còn lại là các thuộc tính khác của user)
    //const obj = { klkl: "klkl", ...others }; //spread là để lấy tất cả các thuộc tính của user (cả password và các thuộc tính khác của user)
    //console.log(obj);

    const passwordIsValid = await bcrypt.compare(passwordd, user.password);
    if (!passwordIsValid) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Password is not correct",
        data: null,
      });
    }

    // const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

    // //refreshToken
    // const refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1y" });//1y=1 năm

    //refreshToken không sử dụng được để đăng nhập, chỉ sử dụng để lấy lại accessToken khi accessToken hết hạn
    const accToken = await signAccessToken(user._id, user.role);
    const refToken = await signRefreshToken(user._id, user.role);

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "success",
      data: others,
      accessToken: accToken,
      refreshToken: refToken
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
      data: null,
    });
  }
}

//update user information
const updateUser = async (req, res) => {
  try {
    console.log(req.body);
    const user = await userService.updateUserInfo(req.params.id, req.body);

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "success",
      data: user
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
      data: null,
    });
  }
}

//get all users ---Admin only
const getSingleUsers = async (req, res) => {
  try {
    console.log("a");
    const user = await userService.getSingleUsers(req.params.id);

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "success",
      data: user
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
      data: null,
    });
  }
}

//delete all users ---Admin only
const deleteAdmin = async (req, res) => {
  try {
    const user = await userService.deleteAdmin(req.params.id);

    await user.remove();
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "success",
      data: user
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
      data: null,
    });
  }
}

//change password
const changePassword = async (req, res) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "User not found",
        data: null,
      });

    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Old password is not correct",
        data: null,
      });
    }

    if (password === newPassword) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Mật khẩu mới phải khác với mật khẩu cũ",
        data: null,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Confirm password is not correct",
        data: null,
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);

    const userData = await userService.changePassword(req.params.id, { password: hashPassword });

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "success",
      data: userData
    });

  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
      data: null,
    });
  }
}


//test
//verifyOtp phone password
const verifyOtp = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Phone number is not exist",
        data: null,
      });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Password is not correct",
        data: null,
      });
    }

    const otp = Number(req.body.otp);
    console.log(user.otp_expiry, Date.now(), user.verified)
    if (user.otp !== otp || user.otp_expiry < Date.now()) {//hàm user.otp_expiry < Date.now() để kiểm tra thời gian hết hạn của mã otp
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP or has been Expired" });
    }

    if (user.otp == otp) {
      // user.verified = true;
      // user.otp = null;
      // user.otp_expiry = null;
      await user.save();
    }

    //loginUser user.service.js
    const userData = await userService.loginUser(user);

    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "success",
      data: userData,
      accessToken: accessToken
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
      data: null,
    });
  }
}

//refresh token
const refToken = async (req, res) => {
  try {
    console.log(req.body);
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Refresh token is not exist",
        data: null,
      });
    }
    const { userId } = await verifyRefreshToken(refreshToken);
    // const accessToken = jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
    // const refToken = jwt.sign({ userId: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1y" });
    const accToken = await signAccessToken(userId);
    const refToken = await signRefreshToken(userId);

    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "success",
      accessToken: accToken,
      refreshToken: refToken
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
      data: null,
    });
  }
}

//logout
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Refresh token is not exist",
        data: null,
      });
    }
    const { userId } = await verifyRefreshToken(refreshToken);

    console.log(userId);

    client.del(userId.toString(), (err, reply) => {
      if (err) {
        console.log(err.message);
        return res.status(httpStatus.BAD_REQUEST).json({
          status: httpStatus.BAD_REQUEST,
          message: err.message,
          data: null,
        });
      }
      console.log(reply);
      return res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "Logout success",
        data: null,
      });
    })
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
      data: null,
    });
  }
}

//followers là người theo dõi mình, following là người mình theo dõi
//follow a user
const follow = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);//user là người được follow
      const currentUser = await User.findById(req.body.userId);//currentUser là người follow

      if (!user.followers.includes(req.body.userId)) {
        const us =await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });

        console.log(us);
        res.status(httpStatus.OK).json({
          status: httpStatus.OK,
          message: "User has been followed",
          data: user,
        });
      } else {
        res.status(httpStatus.BAD_REQUEST).json({
          status: httpStatus.BAD_REQUEST,
          message: "You already follow this user",
          data: null,
        });
      }
    } catch (err) {
      res.status(httpStatus.BAD_REQUEST).json(err);
    }
  }else{
    res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: "You can't follow yourself",
      data: null,
    });
  }
}

//unfollow a user
const unFollow = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {//nếu user.followers có chứa req.body.userId thì mới thực hiện hàm updateOne bên dưới
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(httpStatus.OK).json({
          status: httpStatus.OK,
          message: "User has been unFollowed",
          data: user,
        });
      } else {
        res.status(httpStatus.BAD_REQUEST).json({
          status: httpStatus.BAD_REQUEST,
          message: "You don't follow this user",
          data: null,
        });
      }
    } catch (err) {
      res.status(httpStatus.BAD_REQUEST).json(err);
    }
  }else{
    res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: "You can't unfollow yourself",
      data: null,
    });
  }
}

//get a user
const getAUser = async (req, res) => {
    const userId = req.query.userId;//query được sử dụng để lấy dữ liệu từ url (http://localhost:8800/api/users?userId=123)
    const username = req.query.full_name;//query được sử dụng để lấy dữ liệu từ url (http://localhost:8800/api/users?full_name=123)
    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ full_name: username });
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
}


module.exports = {
  createUser,
  getUsers,
  loginUser,
  updateUser,
  getSingleUsers,
  deleteAdmin,
  changePassword,
  verifyOtp,
  refToken,
  logout,
  follow,
  unFollow,
  getAUser
};
