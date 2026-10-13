import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Cliente responsável pela comunicação com o
 * serviço OAuth 2.0 do Google.
 */
const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

/**
 * Gera a URL de autenticação do Google.
 *
 * O state permite vincular a resposta do Google
 * à solicitação de login iniciada pelo usuário.
 */
export function gerarUrlAutenticacao(state) {
    return googleClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['email', 'profile', 'openid'],
        state
    });
}

/**
 * Processa o código de autorização recebido do Google
 * e valida a identidade do usuário.
 *
 * @param {string} code - Código recebido no callback.
 * @returns {object} Dados do usuário autenticado.
 */
export async function autenticarComGoogle(code) {
    const { tokens } = await googleClient.getToken(code);

    googleClient.setCredentials(tokens);

    const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    return ticket.getPayload();
}