const cors = require('cors');

const corsHandling = {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true,
};

module.exports = cors(corsHandling);