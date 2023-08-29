import User from "../../models/User/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _throw from "../../utils/_throw.js"

const authController = {
    register: async (req, res) => {
        const { username, password } = req.body;
        const duplicate = await User.findOne({ username }).lean();
        try {
            duplicate && _throw({ code: 400, message: 'Tên người dùng đã tồn tại' });

            const newUser = new User(req.body);
            await newUser.validate();

            const hashedPassword = await bcrypt.hash(password, 10);
            newUser.password = hashedPassword;

            newUser.createdAt = new Date();
            await newUser.save();

            return res.status(200).json({ message: "user is created" })

        } catch (error) {
            console.log(error);
        }

    },

    login: async (req, res) => {
        const { username, password } = req.body;
        try {
            if (username) {

                const value = { username }
                // username
                const foundUser = await User.findOne(value);
                !foundUser && _throw({
                    code: 400,
                    message: "Không tìm thấy tên người dùng"
                })

                // password
                const matchPass = await bcrypt.compare(password, foundUser.password);
                !matchPass && _throw({
                    code: 400,
                    message: "Sai mật khẩu"
                })

                // token
                const accessToken = jwt.sign({ username: foundUser.username }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
                });

                const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
                });

                // save token
                foundUser.accessToken = accessToken;
                foundUser.refreshToken = refreshToken;
                foundUser.createdAt = new Date();
                await foundUser.save();

                // res
                return res.status(200).json({
                    data: {
                        _id: foundUser._id,
                        username: foundUser.username,
                        accessToken,
                        refreshToken,
                    },
                    message: 'Đăng nhập thành công',
                });
            } else _throw({ code: 400, message: "Tên người dùng không tồn tại" })
        } catch (error) {
            console.log(error);
        }

    },

    logout: async (req, res) => {
        const foundUser = await User.findOneAndUpdate(
          { username: req.username },
          { accessToken: '', refreshToken: '', lastActiveAt: new Date() },
          { runValidators: true }
        ).lean();
    
        return foundUser
          ? res.status(200).json({ message: 'log out successfully' })
          : _throw({ code: 403, message: 'Invalid refreshToken' });
    },
}

export default authController;
