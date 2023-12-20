'use strict';
var http = require('http');
var options = {
    hostname: '127.0.0.1',
    port: 4723,
    path: '/api/tunnels',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
};
function getPublicUrl() {
    return new Promise((resolve, reject) => {
        var req = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (config) {
                config = JSON.parse(config);
                const httpsTunnel = config.tunnels
                    .filter((t) => t.proto === 'https')
                    .pop();
                resolve(httpsTunnel.public_url);
            });
        });
        req.on('error', function (e) {
            reject(e.message);
        });
        req.end();
    });
}
module.exports = getPublicUrl;
//# sourceMappingURL=url.js.map