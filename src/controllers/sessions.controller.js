import logger from '../utils/loggers.js'; // Importa el logger creado
import { generateToken } from "../utils/jwt.js";

const postSession = async (req, res) => {
    try {
        if (!req.user) {
            logger.error('Usuario no válido'); // Registro de un error
            return res.status(401).send({ mensaje: 'Usuario no válido' });
        }

        const token = generateToken(req.user);
        res.cookie('jwtCookie', token, {
            maxAge: 43200000,
        });

        logger.info('Sesión iniciada correctamente'); // Registro de información
        return res.redirect('../../static/products');
    } catch (error) {
        logger.error(`Error al iniciar sesión: ${error}`); // Registro de un error con información adicional
        res.status(500).send({ mensaje: `Error al iniciar sesión ${error}` });
    }
};

const postRegister = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).send({ mensaje: 'Usuario existente' });
		}
		res.status(200).send({ mensaje: 'Usuario creado' });
	} catch (error) {
		res.status(500).send({ mensaje: `Error al crear el usuario ${error}` });
	}
};

const getCurrentSession = async (req, res) => {
    logger.debug('Obteniendo sesión actual'); // Registro de un mensaje de depuración
    res.status(200).send(req.user);
};

const getGithubCreateUser = async (req, res) => {
    logger.debug('Usuario de GitHub creado'); // Registro de un mensaje de depuración
    return res.status(200).send({ mensaje: 'Usuario creado' });
};

const getGithubSession = async (req, res) => {
    logger.debug('Sesión de GitHub creada'); // Registro de un mensaje de depuración
    req.session.user = req.user;
    res.status(200).send({ mensaje: 'Sesión creada' });
};

const getLogout = (req, res) => {
    if (req.session) {
        req.session.destroy();
    }
    res.clearCookie('jwtCookie');
    logger.info('Sesión cerrada'); // Registro de información sobre cierre de sesión
    res.status(200).send({ resultado: 'Login eliminado', message: 'Logout' });
};

const sessionController = {
    postSession,
    postRegister,
    getCurrentSession,
    getGithubCreateUser,
    getGithubSession,
    getLogout,
};

export default sessionController;