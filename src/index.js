import { PERMISSIONS } from './rbac/permissions.js';
import { hasPermission } from './rbac/rbac.js';
import { getUserByEmail } from './users/users.js';

const usuario = getUserByEmail('gerente@empresa.com');

console.log('Usuário:', usuario.name);
console.log('Papel:', usuario.role);

console.log(
    'Pode visualizar usuários:',
    hasPermission(usuario.role, PERMISSIONS.USUARIO_VISUALIZAR)
);

console.log(
    'Pode excluir usuários:',
    hasPermission(usuario.role, PERMISSIONS.USUARIO_EXCLUIR)
);

console.log(
    'Pode criar relatórios:',
    hasPermission(usuario.role, PERMISSIONS.RELATORIO_CRIAR)
);