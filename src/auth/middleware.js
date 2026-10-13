
/**
 * Middleware responsável por proteger rotas.
 *
 * Caso não exista uma sessão autenticada,
 * o usuário será redirecionado para o login.
 */
export function exigirAutenticacao(req, res, next) {
    if (!req.session.usuarioId) {
        return res.redirect('/');
    }

    next();
}
