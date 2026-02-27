import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import FileUpload from "../models/fileUpload.model.js";

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }
  const user = await User.create({
    fullName,
    email,
    password,
  });

  const profileImage = req.files.profileImage?.[0];
  const coverImage = req.files.coverImage?.[0];

  if (profileImage) {
    const uploaded = await FileUpload.create({
      file: `/Uploads/${profileImage.filename}`,
      fileType: profileImage.mimetype,
      User: user._id,
    });
    user.profileImage = uploaded._id;
  }

  if (coverImage) {
    const uploaded = await FileUpload.create({
      file: `/Uploads/${coverImage.filename}`,
      fileType: coverImage.mimetype,
      User: user._id,
    });
    user.coverImage = uploaded._id;
  }
  await user.save();

  const data = await User.findById(user._id);

  res.json({
    message: "User registered successfully",
    data: data,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not found");
  }
 const isPasswordCorrect =  await  user.isPasswordCorrect(password);
 if(!isPasswordCorrect){
  throw new ApiError(401, "Invalid password");
 }

});

export { register, loginUser };
