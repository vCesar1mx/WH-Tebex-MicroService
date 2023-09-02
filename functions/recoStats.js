const os = require('os');
const axios = require('axios');
const crypto = require('crypto');
const { debug } = require('./../config.json')
async function ID_Digts() {
    const networkInterfaces = os.networkInterfaces();
    // IPv4
    let ipAddress = '';
    for (const iface in networkInterfaces) {
        const addresses = networkInterfaces[iface];
        for (const addr of addresses) {
            if (!addr.internal && addr.family === 'IPv4') {
                ipAddress = addr.address;
                break;
            }
        }
        if (ipAddress) break;
    }
    // MAC
    var mac = '';
    const interfaceNames = Object.keys(networkInterfaces);
    for (const name of interfaceNames) {
        const iface = networkInterfaces[name];
        const filteredIface = iface.filter((details) => !details.internal && details.mac);
        if (filteredIface.length > 0) { mac = filteredIface[0].mac; }
    }
    const selloDS = `${mac}-${ipAddress}`;
    return crypto.createHash('sha256').update(selloDS).digest('hex');
}

async function getDataClient() {
    const tiempoUptimeMs = process.uptime() * 1000; // Convertir a milisegundos
    const segundos = Math.floor(tiempoUptimeMs / 1000) % 60;
    const minutos = Math.floor(tiempoUptimeMs / (1000 * 60)) % 60;
    const horas = Math.floor(tiempoUptimeMs / (1000 * 60 * 60));
    const networkInterfaces = os.networkInterfaces();
    let ipAddress = '';
    for (const iface in networkInterfaces) {
        const addresses = networkInterfaces[iface];
        for (const addr of addresses) {
            if (!addr.internal && addr.family === 'IPv4') {
                ipAddress = addr.address;
                break;
            }
        }
        if (ipAddress) break;
    }

    const startTime = new Date(Date.now() - os.uptime() * 1000);
    var selloDS = await ID_Digts();
    const datos = {
        uptime: `${horas} horas, ${minutos} minutos y ${segundos} segundos`,
        ip: ipAddress,
        startTime: startTime.toString(),
        ping: 'activo',
        selloDS: selloDS
    };

    return datos;
}

async function sendDataServer(datos) {
    var url = 'http://stats.api.katzellc.com:25598/sendStats';
    try {
        const response = await axios.head(url);
        if (response.status >= 200 && response.status < 300) {
            axios.post(url, datos)
                .then((response) => {
                    if (debug == true) { console.log('Respuesta del servidor:', response.data); }
                })
                .catch((error) => {
                    if (debug == true) { console.error('Error al enviar datos:', error); }
                });
        } else {
            if (debug == true) { console.log('Enlace de estadisticas caido.'); }
        }
    } catch (error) {
        if (debug == true) { console.error('INFO STATS... ', error.message); }
    }
}

module.exports = {
    getDataClient,
    sendDataServer,
    ID_Digts
};
