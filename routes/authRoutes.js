import { Router } from 'express';
import authController from "../controllers/Users/authController.js"
import verifyJWT from '../middleware/verifyJWT.js';
import userController from '../controllers/Users/userController.js';

const router = Router();

router
    .post('/register', authController.register)
    .post('/login', authController.login);

router.use(async (req, res, next) => {
    try {
        await verifyJWT(req, res, next);
    } catch (err) {
        console.error(err);
    }
});

router
    .get('/info/id?', userController.getProfile)
    .post('/logout', authController.logout);

export default router;