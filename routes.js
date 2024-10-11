const { getUsers, getUserById, postUser, updateUser, deleteUser } = require('./operation');
const { sendResponse } = require('./response');

const userRoutes = async (req, res) => { 
    const urlParts = req.url.split('/')
    const userId = Number(urlParts[2]);

    switch (req.method) {
        case 'GET':
            if (req.url==='/users') {
                const users = await getUsers();
                sendResponse(res, 200, users);
            } else if (urlParts[1] === 'users' && userId) {
                const user = await getUserById(userId);
                if (user) {
                    sendResponse(res, 200, user);
                } else {
                    sendResponse(res, 404, { message: 'User not found' });
                }

            } else {
                sendResponse(res, 404, { message: 'Route not found' });
            }
            break;

        case 'POST':
            if (req.url === '/users') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    await postUser(body);
                    sendResponse(res, 201, { message: 'User created successfully' });

                });
            } else {
                sendResponse(res, 404, { message: 'Route not found' });
            }
            break;
        case 'PUT':
            if (urlParts[1] === 'users' && userId) {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', async () => {

                    const updatedUser = await updateUser(body, userId);
                    if (updatedUser) {
                        sendResponse(res, 200, updatedUser);
                    } else {
                        sendResponse(res, 404, { message: 'User not found' });
                    }
                });
            } else {
                sendResponse(res, 404, { message: 'Route not found' });
            }
            break;

        case 'DELETE':
            if (urlParts[1] === 'users' && userId) {
                const result = await deleteUser(userId);
                if (result) {
                    sendResponse(res, 200, { message: 'User deleted successfully' });
                } else {
                    sendResponse(res, 404, { message: 'User not found' });
                }

            } else {
                sendResponse(res, 404, { message: 'Route not found' });
            }
            break;

        default:
            sendResponse(res, 405, { message: 'Method not allowed' });
            break;
    }
};

module.exports = userRoutes;
