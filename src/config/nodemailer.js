import logger from '../utils/loggers.js';
import nodeMailer from 'nodemailer';
import 'dotenv/config';

export const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com', // host para gmail;
    port: 465, // puerto de gmail
    secure: true,
    auth: {
        user: process.env.EMAIL_SERVICE,
        pass: process.env.PASSWORD_EMAIL,
    },
});

export const sendRecoveryEmail = async (email, recoveryLink) => {
    const mailOptions = {
        from: process.env.EMAIL_SERVICE,
        to: email,
        subject: 'Recuperar contraseña',
        html: `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    line-height: 1.6;
                }
        
                .container {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 30px;
                    background-color: #fff;
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
                }
        
                h1 {
                    font-size: 28px;
                    text-align: center;
                    color: #333;
                    margin-bottom: 20px;
                }
        
                p {
                    font-size: 16px;
                    margin: 10px 0;
                    color: #555;
                }
        
                a {
                    color: #007bff;
                    text-decoration: none;
                }
        
                .footer {
                    margin-top: 30px;
                    border-top: 1px solid #ddd;
                    padding-top: 20px;
                    text-align: center;
                    color: #777;
                    font-size: 14px;
                }
            </style>
        </head>
        
        <body>
            <div class="container">
                <h1>Recuperar contraseña</h1>
                <p>Para recuperar tu contraseña, haz click en el siguiente enlace:</p>
                <p><a href="${recoveryLink}">Recuperar contraseña</a></p>
                <p>Si no has solicitado recuperar tu contraseña, ignora este mensaje.</p>
                <div class="footer">
                    <p>Derechos Reservados.</p>
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Email enviado a ${email}`);
        return true;
    } catch (error) {
        logger.error(`Error al enviar email: ${error}`);
        return false;
    }
}