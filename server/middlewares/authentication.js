const jwt = require('jsonwebtoken');
/**
 * verificacion de tokens
 */
verification = (req, res, next) => {
    // para entrar a los headers de un request se usa el req
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario = decoded.usuario;
        next();
    })
}
let verifica_role = (req, res, next) => {
    console.log(req);
    if (req.usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: true,
            err: {
                message: 'Usuario no tiene permisos'
            }
        })
    }
}
module.exports = {
    verification,
    verifica_role
};