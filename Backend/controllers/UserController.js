const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const UserToken = require("../utils/UserToken");
const JWT = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
//user Login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid passwordd" });
  }
  // Generate JWT TOKEN  for authentication
  const AccessToken = UserToken.generateAccessToken(user);
  const RefreshToken = UserToken.generateRefreshToken(user);

  // store the AccessToken in the cookie
  const isPod = process.env.NODE_ENV === "production";
  await res.cookie("accessToken", AccessToken, {
    httpOnly: true,
    secure: isPod,
    sameSite: isPod ? "none" : "lax",
    maxAge: 1000 * 60 * 15, // 15 minutes
  });
  //store  the RefreshToken in the cookie
  await res.cookie("refreshToken", RefreshToken, {
    httpOnly: true,
    secure: isPod,
    sameSite: isPod ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
  // store the RefreshToken in the database
  const updateUser = await User.findByIdAndUpdate(user._id, {
    refreshToken: RefreshToken,
  });
  console.log(AccessToken, RefreshToken);
  res.json({ message: "Login successful" });
};

//User Registration
exports.postSignup = async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role: role || "user",
  });
  await newUser.save();
  res.json({ message: "User registered successfully" });
};
//User Logout
exports.postLogout = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  res.status(200).json({ message: "Logout successful" });
};

//refresh Access Token Controller
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No Refresh Token" });
  }
  const user = await User.findOne({ refreshToken: refreshToken });
  !user && res.status(403).json({ message: "Invalid Refresh Token" });
  // verify the refresh token
  JWT.verify(refreshToken, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token expired or invalid" });
    }

    //Rotation
    const newAccessToken = await UserToken.generateAccessToken(user);
    const newRefreshToken = await UserToken.generateRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();
    //save the new access token and refresh token in the cookies
    const isPod = process.env.NODE_ENV === "production";
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isPod,
      sameSite: isPod ? "none" : "lax",
      maxAge: 1000 * 60 * 15,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isPod,
      sameSite: isPod ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(200).json({ message: "Token Refreshed successfully" });
  });
};
