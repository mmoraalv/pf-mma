import productModel from "../models/products.models.js";
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';
import { generateProductErrorInfo } from "../services/errors/info.js";

export const getProducts = async (req, res) => {
    const { limit, page, filter, sort } = req.query

    const pag = page ? page : 1
    const lim = limit ? limit : 10
    const ord = sort == 'asc' ? 1 : -1

    try {
        const products = await productModel.paginate({ filter: filter }, { limit: lim, page: pag, sort: { price: ord } })

        if (products) {
            return res.status(200).send(products)
        }

        res.status(404).send({ error: "Productos no encontrados" })

    } catch (error) {
        res.status(500).send({ error: `Error en consultar productos ${error}` })
    }

}

export const getProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await productModel.findById(id)

        if (product) {
            return res.status(200).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        res.status(500).send({ error: `Error en consultar producto ${error}` })
    }
}

export const postProduct = async (req, res, next) => {
    const { title, description, price, stock, code, category } = req.body;
    try {
        if (!title || !description || !price || !stock || !code || !category) {
            const error = CustomError.createError({
                name: "Product creation error",
                cause: generateProductErrorInfo({ title, description, price, stock, code, category }),
                message: "One or more properties were incomplete or not valid.",
                code: EErrors.INVALID_PRODUCT_ERROR
            });
            next(error);
        } else {
            const newProduct = new productModel({ title, description, price, stock, code, category });
            const savedProduct = await newProduct.save();
            res.status(201).send(savedProduct);
        }
    } catch (error) {
        next(error);
    }
}


export const putProduct = async (req, res) => {
    const { id } = req.params
    const { title, description, code, price, stock, category } = req.body
    try {
        const product = await productModel.findByIdAndUpdate(id, { title, description, code, price, stock, category })

        if (product) {
            return res.status(200).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        res.status(500).send({ error: `Error en actualizar producto ${error}` })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params

    try {
        const product = await productModel.findByIdAndDelete(id)

        if (product) {
            return res.status(200).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        res.status(500).send({ error: `Error en eliminar producto ${error}` })
    }
}