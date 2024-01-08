import { Router } from 'express';
import passport from 'passport';
import { passportError } from '../utils/messageErrors.js';
import sessionController from '../controllers/sessions.controller.js';

const sessionRouter = Router();

sessionRouter.post('/login', passport.authenticate('login'), sessionController.postSession);

sessionRouter.get('/current', passportError('jwt'), sessionController.getCurrentSession);

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user: email'] }),
	sessionController.getGithubCreateUser
);

sessionRouter.get('/githubSession', passport.authenticate('github'),
	sessionController.getGithubSession
);

sessionRouter.get('/logout', sessionController.getLogout);

export default sessionRouter;