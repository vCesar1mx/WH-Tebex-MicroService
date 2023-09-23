const express = require('express');
const fs = require('fs');
const router = express.Router();
const colors = require('colors');
const { debug, api } = require('./../config.json');
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.File({ filename: 'app.log', level: 'info' }),
        new winston.transports.Console() 
    ]
});
router.use('/', function (req, res, next) {
    if (req.path === '/favicon.ico') return res.redirect(api.favicon_url);
    var ip = req.socket.remoteAddress;
    // Update log
    logger.info('Request received from: ' + ip)
    if (debug) { console.log(`${colors.gray(`Nueva venta, debug mode on || from: ${ip}`)}`); }

    if (ip === '::ffff:18.209.80.3' || ip === '::ffff:54.87.231.232') { next(); }
    else {
        console.log(colors.red(`Bad Request from: ${ip}`));
        return res.status(403).jsonp({ error: 'Not authorized' });
    }
});

module.exports = router;

