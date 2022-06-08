const { request, response } = require('express');

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {*} next 
 */
const validarPermisos = (rolRequerido) => {
  return (req, res, next) => {
    console.log(req.rolUsuario)
    if (req.rolUsuario == rolRequerido) next();
    else res.send({error: -1, description: `RUTA: '${req.path}' , metodo: '${req.method}' no autorizada`}) 
    // res.status(403).send('Este usuario no tiene permisos');
  }
};

module.exports = validarPermisos;