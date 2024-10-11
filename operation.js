const { readUsers, writeUsers } = require('./fileHandling.js');
const { sendResponse, findIndexOfUser } = require('./response.js');

const getUsers = async () => {
    const data = await readUsers()
    return data;
}

const getUserById = async (id) => {
    const users = await readUsers()
    let userIndex = findIndexOfUser(users, id)
    return users[userIndex]
}

const postUser = async (body) => {
    const users = await readUsers()
    const newUser = {};
    const params = new URLSearchParams(body);
    for (const [key, value] of params) {
        newUser[key] = value;
    }
    newUser.id = Date.now(); // Assign an ID
    users.push(newUser);
    return await writeUsers(users);
}

const updateUser = async (body, id) => {
         const users = await readUsers()
        const updatedUser = Object.fromEntries(new URLSearchParams(body));
        const userIndex = findIndexOfUser(users, id)
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updatedUser };
            return users[userIndex];           
        }

    }


const deleteUser = async (id) => {
    const users = await readUsers()
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex > -1) {
        users.splice(userIndex, 1);
        return await writeUsers(users);
    }
}





module.exports = {
    getUsers,
    getUserById,
    postUser,
    updateUser,
    deleteUser

}




