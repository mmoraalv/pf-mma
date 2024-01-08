// Importar los módulos necesarios
import { Schema, model } from "mongoose";

// Definir el esquema del mensaje
const messageSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    }
});

// Crear el modelo de mensajes
const messageModel = model("Message", messageSchema);

export default messageModel;