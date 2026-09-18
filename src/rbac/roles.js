import { PERMISSIONS } from './permissions.js';

/**
 * Define os papéis existentes no sistema e
 * as permissões associadas a cada papel.
 */
export const ROLES = {
    ADMINISTRADOR: {
        name: 'Administrador',

        permissions: [
            PERMISSIONS.USUARIO_VISUALIZAR,
            PERMISSIONS.USUARIO_CRIAR,
            PERMISSIONS.USUARIO_EDITAR,
            PERMISSIONS.USUARIO_EXCLUIR,

            PERMISSIONS.RELATORIO_VISUALIZAR,
            PERMISSIONS.RELATORIO_CRIAR,
            PERMISSIONS.RELATORIO_EXCLUIR,

            PERMISSIONS.SISTEMA_CONFIGURAR
        ]
    },

    GERENTE: {
        name: 'Gerente',

        permissions: [
            PERMISSIONS.USUARIO_VISUALIZAR,

            PERMISSIONS.RELATORIO_VISUALIZAR,
            PERMISSIONS.RELATORIO_CRIAR,
            PERMISSIONS.RELATORIO_EXCLUIR
        ]
    },

    COORDENADOR: {
        name: 'Coordenador',

        permissions: [
            PERMISSIONS.RELATORIO_VISUALIZAR,
            PERMISSIONS.RELATORIO_CRIAR
        ]
    }
};