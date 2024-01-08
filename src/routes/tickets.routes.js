import { Router } from 'express';
import ticketsController from '../controllers/tickets.controller.js';

const ticketRouter = Router();

ticketRouter.get('/', ticketsController.getTickets);
ticketRouter.get('/create', ticketsController.createTicket);

export default ticketRouter;