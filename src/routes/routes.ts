import { Router } from 'express';
import { AuthController } from '../controller/authController';

const router = Router();

const authController = new AuthController();

router.post('/register', authController.Register.bind(authController));
router.post('/login', authController.Login.bind(authController));
router.post('/officer-login', authController.OfficerLogin.bind(authController));

export default router;