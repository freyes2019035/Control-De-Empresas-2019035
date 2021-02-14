'use strict'
const jwt = require('jwt-simple')
const moment = require('moment')
const secret = 'controlDeEmpresas_2019035'

exports.createToken = (user) => {
    let payload = {
        sub: user._id,
        userName: user.userName,
        rol: user.rol,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix(),
        company: user.company
    }
    return jwt.encode(payload, secret)
}

