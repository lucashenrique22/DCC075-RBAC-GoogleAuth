import { PERMISSIONS } from './permissions.js';

/**
 * Define os papéis existentes no sistema e
 * as permissões associadas a cada papel.
 */
export const ROLES = {
    ADMINISTRADOR: {
        nome: 'Administrador',

        permissoes: [
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
        nome: 'Gerente',

        permissoes: [
            PERMISSIONS.USUARIO_VISUALIZAR,

            PERMISSIONS.RELATORIO_VISUALIZAR,
            PERMISSIONS.RELATORIO_CRIAR,
            PERMISSIONS.RELATORIO_EXCLUIR
        ]
    },

    COORDENADOR: {
        nome: 'Coordenador',

        permissoes: [
            PERMISSIONS.RELATORIO_VISUALIZAR,
            PERMISSIONS.RELATORIO_CRIAR
        ]
    }
};