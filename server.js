const http = require('http');
const express = require('express');
const server = express();

// Forward all api requests through the server to overcome same-origin policy
const remoteBaseUrl = 'http://www.easports.com/fifa/ultimate-team';
server.get('/api/fut/item', (req, res) => {
    const requestUrl = remoteBaseUrl + req.url;
    const bodyChunks = [];

    http.get(requestUrl, (remoteRes) => {
        remoteRes.on('data', (chunk) => {
            bodyChunks.push(chunk);
        });

        remoteRes.on('end', () => {
            res.type('application/json');
            res.send(Buffer.concat(bodyChunks));
        });
    });
});

// Serve everything in public/ and node_modules/
server.use(express.static('public'));
server.use('/scripts/node_modules', express.static('node_modules'));
server.use('/scripts/bower_components', express.static('bower_components'));

server.listen(80, () => {
    console.log('Server running...');
});