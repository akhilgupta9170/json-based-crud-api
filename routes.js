const { getUsers, getUserById, postUser, updateUser, deleteUser } = require('./operation');
const { sendResponse } = require('./response');

const userRoutes = async (req, res) => {
    const { method, url } = req;
    const pathParts = url.split('/');
    const userId = Number(pathParts[2]); 

    switch (method) {
        case 'GET':
            if (url === '/users') {
                    const users = await getUsers();
                    sendResponse(res, 200, users);    
            } else if (pathParts[1] === 'users' && userId) {
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
            if (url === '/users') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    try {
                        await postUser(body);
                        sendResponse(res, 201, { message: 'User created successfully' });
                    } catch (error) {
                        sendResponse(res, 500, { message: 'Error creating user', error });
                    }
                });
            } else {
                sendResponse(res, 404, { message: 'Route not found' });
            }
            break;

        case 'PUT':
            if (pathParts[1] === 'users' && userId) {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    try {
                        const updatedUser = await updateUser(body, userId);
                        if (updatedUser) {
                            sendResponse(res, 200, updatedUser);
                        } else {
                            sendResponse(res, 404, { message: 'User not found' });
                        }
                    } catch (error) {
                        sendResponse(res, 500, { message: 'Error updating user', error });
                    }
                });
            } else {
                sendResponse(res, 404, { message: 'Route not found' });
            }
            break;

        case 'DELETE':
            if (pathParts[1] === 'users' && userId) {
                try {
                    const result = await deleteUser(userId);
                    if (result) {
                        sendResponse(res, 200, { message: 'User deleted successfully' });
                    } else {
                        sendResponse(res, 404, { message: 'User not found' });
                    }
                } catch (error) {
                    sendResponse(res, 500, { message: 'Error deleting user', error });
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
