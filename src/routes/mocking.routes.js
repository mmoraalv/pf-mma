import { Router } from "express";
import generateMockProducts from '../controllers/mocking.controller.js';

const mockingRouter = Router();

mockingRouter.get('/mockingProducts', generateMockProducts);

export default mockingRouter;