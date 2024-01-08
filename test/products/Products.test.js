//import 'dotenv/config';
import productModel from '../../src/models/products.models.js';
import Assert from 'assert';
import mongoose from 'mongoose';

await mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('DB conectada'))
	.catch(error => console.log(`Error en conexión a MongoDB Atlas:  ${error}`));

const assert = Assert.strict;

describe('Testing Products', () => {
	beforeEach(function () {
		this.timeout(7000);
	});

	let id;

	it('Crear un nuevo producto', async function () {
		const newProduct = {
			title: 'Teclado',
			description: 'USB Ergonomico',
			category: 'Teclados',
			price: 50,
			stock: 15,
			code: 'TUSB01',
		};
		const resultado = await productModel.create(newProduct);
		id = resultado._id;
		assert.ok(resultado._id);
	});

	it('Consultar un producto por su id', async function () {
		const product = await productModel.findById(id);
		assert.strictEqual(typeof product, 'object');
	});

	it('Eliminar un producto por su id', async function () {
		const product = await productModel.findByIdAndRemove(id);
		assert.strictEqual(typeof product, 'object');
	});

	it('Consultar todos los productos de mi aplicacion', async function () {
		const products = await productModel.find();
		assert.strictEqual(Array.isArray(products), true);
	});
});