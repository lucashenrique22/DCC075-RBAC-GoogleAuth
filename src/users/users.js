import { ROLES } from '../rbac/roles.js';

/**
 * Usuários cadastrados no sistema.
 *
 * Nesta primeira versão, os dados ficam em memória
 * apenas para demonstrar o funcionamento do RBAC.
 *
 * Posteriormente, o OAuth2 do Google fornecerá o e-mail
 * do usuário autenticado e utilizaremos esse e-mail para
 * localizar seu papel no sistema.
 */
export const USERS = [
    {
        name: 'Administrador',
        email: 'admin@empresa.com',
        role: 'ADMINISTRADOR'
    },

    {
        name: 'Gerente',
        email: 'gerente@empresa.com',
        role: 'GERENTE'
    },

    {
        name: 'Coordenador',
        email: 'coordenador@empresa.com',
        role: 'COORDENADOR'
    }
];

/**
 * Busca um usuário pelo e-mail.
 *
 * @param {string} email - E-mail do usuário.
 * @returns {object|undefined} Usuário encontrado.
 */
export function getUserByEmail(email) {
    return USERS.find(usuario => usuario.email === email);
}