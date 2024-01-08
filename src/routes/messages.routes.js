import { Router } from 'express';
import messagesController from '../controllers/messages.controller.js';

const messageRouter = Router();

messageRouter.get('/', messagesController.getMessages);

messageRouter.post('/', messagesController.postMessage);

export default messageRouter;