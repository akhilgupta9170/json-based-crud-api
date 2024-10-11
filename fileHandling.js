const fs = require('fs/promises');
const path = require('path');
const { fileURLToPath } = require('url');


const filePath = path.join(__dirname, 'users.json');

// Read users from JSON file
const readUsers = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users:', error);
        throw new Error('Internal Server Error');
    }
};

// Write users to JSON file
const writeUsers = async (users) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing users:', error);
        throw new Error('Internal Server Error');
    }
};





module.exports = {
    readUsers,
    writeUsers,
};
