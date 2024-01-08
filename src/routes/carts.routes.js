import { Router } from 'express';
import cartsController from '../controllers/carts.controller.js';
import { authorization, passportError } from '../utils/messageErrors.js';
const cartRouter = Router();

cartRouter.get('/', cartsController.getCarts);
cartRouter.get('/:cid', cartsController.getCart);

cartRouter.post(
	'/:cid/purchase',
	passportError('jwt'),
	authorization(['user', 'premium']),
	cartsController.purchaseCart
);

cartRouter.post('/', cartsController.postCart);

cartRouter.put(
	'/:cid/product/:pid',
	passportError('jwt'),
	authorization(['user', 'premium']),
	cartsController.putProductToCart
);
cartRouter.put(
	'/:cid/products/:pid',
	passportError('jwt'),
	authorization(['user', 'premium']),
	cartsController.putQuantity
);
cartRouter.put(
	'/:cid',
	passportError('jwt'),
	authorization(['user', 'premium']),
	cartsController.putProductsToCart
);
cartRouter.delete(
	'/:cid', 
	passportError('jwt'), 
	authorization(['user', 'premium']), 
	cartsController.deleteCart
);

cartRouter.delete(
	'/:cid/products/:pid',
	passportError('jwt'),
	authorization(['user', 'premium']),
	cartsController.deleteProductFromCart
);

export default cartRouter;