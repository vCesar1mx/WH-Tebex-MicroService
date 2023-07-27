const express = require('express');
const fs = require('fs');
const router = express.Router();
const colors = require('colors');
const { debug, api } = require('./../config.json')
router.use('/', function (req, res, next) {
    if (req.path === '/favicon.ico') return res.redirect(api.favicon_url);
    var ip = req.socket.remoteAddress;
    // Update log
    fs.appendFile('server-access.log', `Request received from: ${ip}\r\n`, function (err) {
        if (err) throw err;
    });
    if (debug) { console.log(`${colors.gray(`Nueva venta, debug mode on || from: ${ip}`)}`); }

    if (ip === '::ffff:18.209.80.3' || ip === '::ffff:54.87.231.232') { next(); }
    else {
        console.log(colors.red(`Bad Request from: ${ip}`));
        return res.status(403).jsonp({ error: 'Not authorized' });
    }
});

module.exports = router;

