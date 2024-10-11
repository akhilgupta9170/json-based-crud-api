const http = require('http');
const userRoutes = require('./routes.js');

const PORT = 3000;

const server = http.createServer(userRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
