const { request, response } = require('express');

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {*} next 
 */
const validarLogueado = (req, res, next) => {
  const tokenDeUsuario = req.header('Admin');
  const admin = true

  if (tokenDeUsuario) {
    // Le consultamos a la API
    req.rolUsuario = admin;
    next();
  }
  else res.status(401).send('Sin autorizacion');
  // { error : -1, descripcion: ruta 'x' método 'y' no autorizada }

};

module.exports = validarLogueado;