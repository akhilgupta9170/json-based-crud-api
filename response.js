const sendResponse = (res, statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

const findIndexOfUser = (users, id) => {
    return users.findIndex(user => user.id === id);
};

module.exports = { sendResponse, findIndexOfUser };
 