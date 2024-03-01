const jwt = require('jsonwebtoken');
const { NotFoundError } = require('./errors');

const isAuth = (req, res, next) => {
    const header = req.get('Authorization');
    if(!header) {
        return next(new NotFoundError('No headers found'));
    }
    const authToken = header.split(' ')[1];
    if(!authToken) {
        return next(new NotFoundError('Not Authenticated'));
    }
    try {
        const validatedToken = jwt.verify(authToken, 'superstrongkey');
        req.token = validatedToken;
    } catch(err) {
        return next(new NotFoundError('Not Authenticated'));
    }
    next();
}

exports.isAuth = isAuth;