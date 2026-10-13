import express from 'express';

import {
    gerarUrlAutenticacao,
    autenticarComGoogle
} from './auth/google.js';

const app = express();
const PORT = 3000;

/**
 * Página inicial.
 *
 * Gera a URL de autenticação do Google e
 * disponibiliza o link para o usuário.
 */
app.get('/', (req, res) => {
    const url = gerarUrlAutenticacao();

    res.send(`
        <h1>Autenticação com Google OAuth2</h1>

        <a href="${url}">
            Clique aqui para fazer login
        </a>
    `);
});

/**
 * Callback utilizado pelo Google após a autenticação.
 */
app.get('/callback', async (req, res) => {
    try {
        const { code } = req.query;

        const payload = await autenticarComGoogle(code);

        const name = encodeURIComponent(payload.name);
        const email = encodeURIComponent(payload.email);

        res.redirect(`/welcome?name=${name}&email=${email}`);
    } catch (error) {
        console.error('Erro na autenticação:', error);

        res.status(500).send(
            'Erro ao autenticar com o Google.'
        );
    }
});

/**
 * Página exibida após a autenticação.
 */
app.get('/welcome', (req, res) => {
    const { name, email } = req.query;

    res.send(`
        <h1>Bem-vindo, ${name}!</h1>
        <p>Seu e-mail: ${email}</p>
    `);
});

app.listen(PORT, () => {
    console.log(
        `Servidor rodando em http://localhost:${PORT}`
    );
});