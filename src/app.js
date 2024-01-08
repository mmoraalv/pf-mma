//import 'dotenv/config' //Permite utilizar variables de entorno
import express from 'express';
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './path.js'
import path from 'path'
import router from './routes/index.routes.js';
import routerHandlebars from './routes/views.routes.js'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose';
import initializePassport from './config/passport.js'
import generateMockProducts from './controllers/mocking.controller.js';

const PORT = 3000;
const app = express();

//Conexión con bd Mongo
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB conectada"))
    //await cartModel.create({})
    .catch((error) => console.log("Error en conexion a MongoDB Atlas: ", error))

//Server
const server = app.listen(PORT,()=>{
    console.log(`Server on port: ${PORT}`);
})

//const io = new Server(server)

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //URL extensas
app.use(cookieParser(process.env.JWT_SECRET)) //Firmo la cookie
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {usenewUrlParser: true, useUnifiedTopology: true},
        ttl: 90 //tiempo en segundos
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

function auth(req,res,next) {
    console.log(req.session.email)
    if(req.session.email == process.env.ADMIN_EMAIL && req.session.password == process.env.ADMIN_PASSWORD) {
        return next() //sigue con la ejecución normal de la ruta
    }
    return res.send('No tiene acceso a este contenido')
}

app.get('/admin', auth, (req,res) => {
    res.send('Eres administrador')
})

app.post('/products', (req,res) => {
        req.session.destroy()
        res.redirect(301, '/')
})

//Handlebars
app.engine('handlebars', engine()) //Defino que voy a trabajar con Handlebars
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

//Rutas
app.use('/static', express.static(path.join(__dirname, '/public')));
app.use('/static', routerHandlebars);
app.use('/', router);
//app.get('/mockingproducts', generateMockProducts);

//Cookies
/*app.get('/setCookie', (req, res) => {
    res.cookie('CookieCookie', 'Esto es el valor de una cookie',{ maxAge: 60000, signed: true }).send('Cookie creada') //Cookie de un minuto firmada
})

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies) //Consultar solo las cookies firmadas
    //res.send(req.cookies) Consultar TODAS las cookies
}) */

//Conexion de Socket.io

/*const mensajes = []

io.on('connection', socket => {
	console.log('Conexión con Socket.io');

    socket.on('mensaje', async info => {
        console.log(info);
        mensajes.push(info);
        io.emit('mensajes', mensajes);

        // Guardar el mensaje en la base de datos utilizando el modelo
        try {
            await messageModel.create({
                user: info.user,
                mensaje: info.mensaje
            });
        } catch (error) {
            console.error("Error al guardar el mensaje en la base de datos:", error);
        }
    });
});*/
