const { request, response } = require('express');

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {*} next 
 */
const middlewareAutorizacion = (req,res,next) => {
  if (req.user.isAdmin) next()
  else res.status(401).send({error: -1, description: `RUTA: '${req.path}' , metodo: '${req.method}' no autorizada`})
  
};

module.exports = middlewareAutorizacion;