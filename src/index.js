
import express from 'express';
import session from 'express-session';
import { randomBytes } from 'node:crypto';

import {
    gerarUrlAutenticacao,
    autenticarComGoogle
} from './auth/google.js';

import { exigirAutenticacao } from './auth/middleware.js';

import {
    USERS,
    getUserByEmail
} from './users/users.js';

import { ROLES } from './rbac/roles.js';
import { PERMISSIONS } from './rbac/permissions.js';
import { hasPermission } from './rbac/rbac.js';

const app = express();
const PORT = 3000;

// Configura o gerenciamento de sessões.
// O cookie guarda somente o identificador da sessão.
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Evita inserir dados externos diretamente no HTML.
function escaparHtml(valor) {
    return String(valor).replace(/[&<>"']/g, caractere => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caractere]);
}

// Página inicial.
app.get('/', (req, res) => {
    res.send(`
        <h1>Sistema de Segurança</h1>
        <a href="/login">Entrar com Google</a>
    `);
});

// Inicia o processo de autenticação.
app.get('/login', (req, res) => {
    const state = randomBytes(32).toString('hex');

    // Guarda o state na sessão para validar o callback.
    req.session.oauthState = state;

    req.session.save(error => {
        if (error) {
            return res.status(500).send('Erro ao iniciar login.');
        }

        res.redirect(gerarUrlAutenticacao(state));
    });
});

// Callback chamado pelo Google.
app.get('/callback', async (req, res) => {
    try {
        const { code, state } = req.query;

        // Verifica se o retorno corresponde ao login iniciado.
        if (
            typeof code !== 'string' ||
            typeof state !== 'string' ||
            !req.session.oauthState ||
            state !== req.session.oauthState
        ) {
            return res.status(400).send('Autenticação inválida.');
        }

        delete req.session.oauthState;

        // Obtém os dados autenticados pelo Google.
        const payload = await autenticarComGoogle(code);

        // Exige um e-mail verificado pelo Google.
        if (!payload.email || payload.email_verified !== true) {
            return res.status(403).send('E-mail não verificado.');
        }

        // Identifica o usuário cadastrado no sistema.
        const usuario = getUserByEmail(payload.email);

        // O Google autentica, mas nossa aplicação autoriza.
        if (!usuario || !ROLES[usuario.role]) {
            return res.status(403).send(
                'Acesso negado: usuário não autorizado.'
            );
        }

        // Regenera a sessão após a autenticação.
        req.session.regenerate(error => {
            if (error) {
                return res.status(500).send('Erro ao criar sessão.');
            }

            // Guarda somente a identidade local.
            // O papel será consultado no cadastro do sistema.
            req.session.usuarioId = usuario.email;

            req.session.save(error => {
                if (error) {
                    return res.status(500).send('Erro ao salvar sessão.');
                }

                res.redirect('/welcome');
            });
        });

    } catch (error) {
        console.error('Erro na autenticação:', error);
        res.status(500).send('Erro ao autenticar com Google.');
    }
});

// Página autenticada com demonstração do RBAC.
app.get('/welcome', exigirAutenticacao, (req, res) => {

    // Recupera o usuário a partir da identidade da sessão.
    const usuario = getUserByEmail(req.session.usuarioId);

    if (!usuario || !ROLES[usuario.role]) {
        return res.status(403).send('Acesso não autorizado.');
    }

    // Monta a lista de permissões e verifica cada uma pelo RBAC.
    const resultado = Object.values(PERMISSIONS).map(permissao => {
        const permitido = hasPermission(usuario.role, permissao);

        return `
            <li>
                ${escaparHtml(permissao)}:
                ${permitido ? 'Permitido ✓' : 'Negado ✗'}
            </li>
        `;
    }).join('');

    res.send(`
        <h1>Sistema de Segurança</h1>

        <h2>Bem-vindo, ${escaparHtml(usuario.name)}!</h2>

        <p>E-mail: ${escaparHtml(usuario.email)}</p>

        <p>
            Papel:
            <strong>${escaparHtml(ROLES[usuario.role].name)}</strong>
        </p>

        <h3>Controle de acesso (RBAC)</h3>

        <ul>
            ${resultado}
        </ul>

        <a href="/logout">Sair</a>
    `);
});

// Encerra a sessão do usuário.
app.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            return res.status(500).send('Erro ao encerrar sessão.');
        }

        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
