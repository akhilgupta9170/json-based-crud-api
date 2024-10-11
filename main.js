const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const dataFilePath = path.join(__dirname, 'users.json');

const readUsers = async () => {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
};

const writeUsers = async (users) => {
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2));
};

const sendResponse = (res, statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

const findIndexOfUser = (users, id) => {
    return users.findIndex(user => user.id === id);
};

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    const urlParts = req.url.split('/');
    const id = Number(urlParts[2]);
    let users;

    try {
        users = await readUsers();
    } catch (error) {
        return sendResponse(res, 500, { message: 'Internal Server Error' });
    }

    switch (req.method) {
        case "GET":
            const getUsers = (res) => {
                return sendResponse(res, 200, users);
            }
            const getUserById = (res, id) => {
                const userIndex = findIndexOfUser(users, id);
                if (userIndex > -1) {
                    return sendResponse(res, 200, users[userIndex]);
                }
                return sendResponse(res, 404, { message: 'User not found' });
            }

            const handleRequest = (req, res, urlParts, id) => {
                if (req.url==='/users') {
                    return getUsers(res);
                }
                else if (urlParts[1] === 'users' && id) {
                    return getUserById(res, id);
                }
            }
            handleRequest(req, res, urlParts, id);

            break;


        case "POST":
            if (req.url === '/users') {
                let body = "";
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    const newUser = {};
                    const params = new URLSearchParams(body);
                    for (const [key, value] of params) {
                        newUser[key] = value;
                    }
                    newUser.id = users.length + 1;
                    users.push(newUser);
                    await writeUsers(users);
                    return sendResponse(res, 201, newUser);
                });
            } else {
                return sendResponse(res, 404, { message: 'Not Found' });
            }
            break;

        case 'PUT':
            if (urlParts[1] === 'users' && id) {
                let body = "";
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    const updatedUser = Object.fromEntries(new URLSearchParams(body));
                    const userIndex = findIndexOfUser(users, id)
                    if (userIndex !== -1) {
                        users[userIndex] = { ...users[userIndex], ...updatedUser };
                        await writeUsers(users);
                        return sendResponse(res, 200, users[userIndex]);
                    }
                    return sendResponse(res, 404, { message: 'User not found' });
                });
            } else {
                return sendResponse(res, 404, { message: 'Not Found' });
            }
            break;

        case 'DELETE':
            const deleteUser = async () => {
                if (urlParts[1] === 'users' && id) {
                    searchUser(id);
                } else {
                    return sendResponse(res, 404, { message: 'Not Found' });
                }
            }
            const searchUser = async (id) => {
                const userIndex = findIndexOfUser(users, id);
                if (userIndex !== -1) {
                    users.splice(userIndex, 1);
                    await writeUsers(users);
                    return sendResponse(res, 204);
                }
                return sendResponse(res, 404, { message: 'User not found' });

            }
            deleteUser();

            break;



        default:
            return sendResponse(res, 405, { message: 'Method Not Allowed' });
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
