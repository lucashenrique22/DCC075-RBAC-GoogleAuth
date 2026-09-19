import { ROLES } from './roles.js';

/**
 * Verifica se um papel possui determinada permissão.
 *
 * @param {string} role - Papel do usuário.
 * @param {string} permission - Permissão que queremos verificar.
 * @returns {boolean} true caso o papel possua a permissão.
 */
export function hasPermission(role, permission) {
    const roleDefinition = ROLES[role];

    // Caso o papel não exista, o acesso deve ser negado.
    if (!roleDefinition) {
        return false;
    }

    return roleDefinition.permissions.includes(permission);
}