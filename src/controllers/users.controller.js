import crypto from 'crypto';
import { sendRecoveryEmail } from '../config/nodemailer.js';
import userModel from '../models/users.model.js';
import logger from '../utils/loggers.js';
import { createHash, validatePassword } from '../utils/bcrypt.js';
//import 'dotenv/config'

const postUser = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).send({ mensaje: 'Usuario existente' });
		}
		res.status(200).send({ mensaje: 'Usuario creado' });
	} catch (error) {
		res.status(500).send({ mensaje: `Error al crear el usuario ${error}` });
	}
};

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        logger.info(`Usuarios encontrados: ${users.length}`);
        return res.status(200).send(users);
    } catch (error) {
        logger.error(`Error al obtener usuarios: ${error}`);
        return res.status(500).send({ error: `Error al obtener usuarios: ${error}` });
    }
}

const recoveryLinks = {};

const recoveryPassword = async (req, res) => {
    const { email } = req.body;

    try {
        //Verificacion de usuario existente
        const user = await userModel.findOne({ email });
        if (!user) {
            logger.error(`Usuario no encontrado: ${email}`);
            return res.status(400).send({ error: `Usuario no encontrado: ${email}` });
        }

        //Generacion de token
        const token = crypto.randomBytes(20).toString('hex');
        recoveryLinks[token] = { email, timestamp: Date.now() };

        //Envio de email
        const recoveryLink = `${process.env.RECOVERY_URL}${token}`;
        sendRecoveryEmail(email, recoveryLink);
        res.status(200).send({ resultado: 'OK', message: 'Email enviado correctamente' });
    } catch (error) {
        logger.error(`Error al enviar email: ${error}`);
        res.status(500).send({ error: `Error al enviar email de recuperacion: ${error}` });
    }
}

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const linkData = recoveryLinks[token];
        if (!linkData) {
            logger.error(`Token no encontrado: ${token}`);
            return res.status(400).send({ error: `Token no encontrado: ${token}` });
        }

        const now = Date.now();
        const tokenTimestamp = linkData.timestamp;
        const tokenAge = now - tokenTimestamp;

        if (tokenAge > process.env.TOKEN_EXPIRATION_TIME) {
            logger.error(`Token expirado: ${token}`);
            return res.status(400).send({ error: `Token expirado: ${token}` });
        }

        const { email } = linkData;

        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                logger.error(`Usuario no encontrado: ${email}`);
                return res.status(400).send({ error: `Usuario no encontrado: ${email}` });
            }

            // Check if new password === password in database
            const isSamePassword = validatePassword(newPassword, user.password);
            if (isSamePassword) {
                logger.error(`La nueva contraseña no puede ser igual a la anterior`);
                return res.status(400).send({ error: `La nueva contraseña no puede ser igual a la anterior` });
            }

            // Update the users password in the database
            user.password = createHash(newPassword);
            await user.save();

            // Delete token
            delete recoveryLinks[token];
            logger.info(`Password actualizado correctamente para el usuario ${email}`);
            return res.status(200).send({ resultado: 'OK', message: 'Password actualizado correctamente' });
        } catch (error) {
            logger.error(`Error al modificar contraseña: ${error}`);
            return res.status(500).send({ error: `Error al modificar contraseña: ${error}` });
        }
    } catch (error) {
        logger.error(`Error al actualizar password: ${error}`);
        return res.status(500).send({ error: `Error al actualizar password: ${error}` });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            logger.error(`Usuario no encontrado: ${id}`);
            return res.status(400).send({ error: `Usuario no encontrado: ${id}` });
        }

        logger.info(`Usuario eliminado correctamente: ${id}`);
        return res.status(200).send({ resultado: 'OK', message: 'Usuario eliminado correctamente' });
    } catch (error) {
        logger.error(`Error al eliminar usuario: ${error}`);
        return res.status(500).send({ error: `Error al eliminar usuario: ${error}` });
    }
}

const uploadDocuments = async (req, res) => {
    const { id } = req.params;

    try {
        const uploadedFiles = req.files['documents'];

        if (!uploadedFiles || uploadedFiles.length === 0) {
            logger.error(`No documents uploaded`);
            return res.status(400).send({ error: 'No documents uploaded' });
        }

        const user = await userModel.findById(id);
        if (!user) {
            logger.error(`Usuario no encontrado: ${id}`);
            return res.status(400).send({ error: `Usuario no encontrado: ${id}` });
        }

        // Clear existing documents array before adding new ones
        user.documents = [];

        // Save filenames of each uploaded document to the user model
        uploadedFiles.forEach((file) => {
            user.documents.push(file.filename);
        });

        await user.save();

        logger.info(`Documentos actualizados correctamente para el usuario ${id}`);
        return res.status(200).send({ resultado: 'OK', message: 'Documentos actualizados correctamente' });
    } catch (error) {
        logger.error(`Error al actualizar documentos: ${error}`);
        return res.status(500).send({ error: `Error al actualizar documentos: ${error}` });
    }
}

const deleteInactiveUsers = async (req, res) => {
    try {
        const users = await userModel.find({ last_connection: { $lt: new Date(Date.now() - process.env.USERS_INACTIVE_TIME) } });

        if (users.length === 0) {
            logger.warn(`No se encontraron usuarios inactivos`);
            return res.status(400).send({ error: `No se encontraron usuarios inactivos` });
        }

        await Promise.all(users.map(async (user) => {
            const { _id, email, cart } = user;
            try {
                await sendAccountDeletion(email);
                await userModel.findByIdAndDelete(_id);
                await cartsModel.findByIdAndDelete(cart);
            } catch (error) {
                logger.error(`Error al procesar usuario: ${error.message}`);
                return res.status(500).send({ error: `Error al procesar usuario: ${error.message}` });
            }
        }));
        logger.info(`Usuarios inactivos eliminados correctamente: ${users.length}`);
        return res.status(200).send({ resultado: 'OK', message: 'Usuarios inactivos eliminados correctamente' });
    } catch (error) {
        logger.error(`Error al eliminar usuarios inactivos: ${error}`);
        return res.status(500).send({ error: `Error al eliminar usuarios inactivos: ${error}` });
    }
};

const usersController = { getUsers, postUser, recoveryPassword, resetPassword, deleteUser, uploadDocuments, deleteInactiveUsers };

export default usersController;