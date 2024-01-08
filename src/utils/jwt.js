//import 'dotenv/config'
import jwt from 'jsonwebtoken'

export const generateToken = (user) => {
    /*
        1° parametro: Objeto asociado al token
        2° parametro: Clave privada para el cifrado
        3° parametro: Tiempo de expiracion
    */
    const token = jwt.sign({ user }, "mma3546", { expiresIn: '12h' })
    return token
}

//console.log(generateToken({"_id":"6535ff81173241f390588a3b","first_name":"Mario","last_name":"Mora","email":"mario@mora.com","password":"$2b$15$lWp2f8OiZ84v3k9s0M.M7.OaEn7DSDegKrbiSCTzIfujckEbdmPZ6","rol":"user","age":{"$numberInt":"33"}}))

export const authToken = (req, res, next) => {
    //Consulto el header
    const authHeader = req.headers.Authorization //Consulto si existe el token
    if (!authHeader) {
        return res.status(401).send({ error: 'Usuario no autenticado' })
    }

    const token = authHeader.split(' ')[1] //Separado en dos mi token y me quedo con la parte valida

    jwt.sign(token, process.env.JWT_SECRET, (error, credentials) => {
        if (error) {
            return res.status(403).send({ error: "Usuario no autorizado" })
        }
        //Descifro el token
        req.user = credentials.user
        next()
    })
}