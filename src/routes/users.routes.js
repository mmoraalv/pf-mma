import { Router } from 'express';
import passport from 'passport';
import usersController from '../controllers/users.controller.js';
import { upload } from "../config/config.js";

const userRouter = Router();

userRouter.post('/', passport.authenticate('register'), usersController.postUser);

userRouter.get('/', usersController.getUsers);

userRouter.post('/recovery', usersController.recoveryPassword);

userRouter.post('/resetpassword/:token', usersController.resetPassword);

userRouter.post('/api/:uid/documents', upload.array('documents'), usersController.uploadDocuments);

userRouter.delete('/', usersController.deleteInactiveUsers);

export default userRouter;