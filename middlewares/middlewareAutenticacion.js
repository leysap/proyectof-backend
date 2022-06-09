const { request, response } = require('express');

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {*} next 
 */
const middlewareAutenticacion = (req, res, next) => {
  req.user = {
    fullName: "Leysa Pozo",
    isAdmin: true
  };
  next();

};

module.exports = middlewareAutenticacion;