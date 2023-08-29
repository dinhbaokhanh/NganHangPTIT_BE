import jwt from "jsonwebtoken";
import User from "../models/User/User.js";
import _throw from "../utils/_throw.js";

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    !authHeader && _throw({ code: 401, message: 'auth header not found' });
    !authHeader.startsWith('Bearer ') &&
        _throw({
            code: 403,
            errrors: [{ field: 'accessToken', message: 'invalid' }],
            message: 'invalid token',
        });

    const accessToken = authHeader.split(' ')[1];

    await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        err && _throw({ code: 403, message: 'invalid token' });
        req.username = decoded.username;
    });

    const foundUser = await User.findOne({ accessToken });
    !foundUser &&
        _throw({
            code: 403,
            errrors: [{ field: 'accessToken', message: 'outdated' }],
            message: 'outdated token',
        });
    req.userInfo = foundUser;

    // Call the next middleware function
    next();
}

export default verifyJWT;