const os = require('os');
const axios = require('axios');

function getDataClient() {
    const uptimeInSeconds = process.uptime();
    const uptimeInHours = uptimeInSeconds / 3600;

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

    const datos = {
        uptime: `${uptimeInHours} horas`,
        ip: ipAddress,
        startTime: startTime.toString(),
        ping: 'activo', // Puedes configurar esto según tus necesidades
    };

    return datos;
}

function sendDataServer(datos) {
    return console.log(datos)
    axios.post('http://localhost:3000/recopilar-datos', datos)
        .then((response) => {
            console.log('Respuesta del servidor:', response.data);
        })
        .catch((error) => {
            console.error('Error al enviar datos:', error);
        });
}

module.exports = {
    getDataClient,
    sendDataServer,
};
