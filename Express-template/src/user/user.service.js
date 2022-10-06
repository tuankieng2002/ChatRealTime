const User = require("./user.model");

const createUser = async (userBody) => {
  //Phone number already exists
  if (await User.findOne({ phone: userBody.phone })) {
    throw new Error("Phone number already exists");
  }
  return User.create(userBody);
};

const getUsers = async () => {
  return await User.find();
};

//login phone password
const loginUser = async (userBody) => {
  return await User.findOne(userBody).lean();
};

const updateUserInfo = async (userId, userBody) => {
  return await User.findByIdAndUpdate(userId, userBody, { new: true });
};

const getSingleUsers = async (userId) => {
  return await User.findById(userId);
}

const deleteAdmin = async (userId) => {
  return await User.findById(userId);
}

const changePassword = async (userId, userBody) => {
  return await User.findByIdAndUpdate(userId, userBody, { new: true });
}

//verifyOtp
// const verifyOtp = async (userId) => {
//   return await User.findById(userId);
// }


module.exports = {
  createUser,
  getUsers,
  loginUser,
  updateUserInfo,
  getSingleUsers,
  deleteAdmin,
  changePassword,
  //verifyOtp
};
