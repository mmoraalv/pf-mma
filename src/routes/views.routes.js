import { Router } from "express";
import productModel from "../models/products.models.js";
const routerHandlebars = Router ();

routerHandlebars.get ("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts", {
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts",
    });
});

routerHandlebars.get ("/products", async (req, res) => {
    const products = await productModel.find().lean();
    const info = req.query.info;
    res.render("products", {
        rutaCSS: "products",
        rutaJS: "products",
        products,
        info,
    });
});

routerHandlebars.get ("/chat", async (req, res) => {
    res.render("chat", {
        rutaCSS: "chat",
        rutaJS: "chat",
    });
});

routerHandlebars.get ("/register", async (req, res) => {
    res.render("register", {
        rutaCSS: "register",
    });
});

routerHandlebars.get ("/login", async (req, res) => {
    res.render("login", {
        rutaCSS: "login",
    });
});

export default routerHandlebars;