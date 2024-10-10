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

const PORT = process.env.PORT || 3000;
const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');



    switch (req.method) {
        case "GET":
            if (req.url === '/users') {
                const users = await readUsers();
                res.writeHead(200);
                res.end(JSON.stringify(users, null, 2));
            }
            else {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'Not Found' }));
            }
            break;

        case "POST":
            if (req.url === '/users') {
                let body = "";
                req.on('data', (chunck) => {
                    body += chunck.toString();

                })
                req.on('end', async () => {

                    const newUser = {};
                    const params = new URLSearchParams(body);
                    for (const [key, value] of params) {
                        newUser[key] = value;
                    }
                    const users = await readUsers();
                    newUser.id = users.length + 1;
                    users.push(newUser);
                    await writeUsers(users);
                    res.writeHead(201);
                    res.end(JSON.stringify(newUser));
                })
            }
            else {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'Not Found' }));
            }
            break;
            case 'PUT':
                if(req.url === './users/:id'){
                    let body ="";
                    req.on('data', (chunks)=>{
                        body += chunks.toString();
                    })
                    req.on('end', async () => {
                        const params = new URLSearchParams(body);
                        const id = req.params.id;
                        const updatedUser = {};
                        for (const [key, value] of params){
                            updatedUser[key] = value;
                        }
                        const users = await readUsers();
                        const userIndex = users.findIndex(user => user.id ===id)
                        if(userIndex!== -1){
                            const currentUser = users[userIndex];
                            for (const key in updatedUser){
                                currentUser[key] = updatedUser[key];
                            }
                            users[userIndex] = currentUser;
                            await writeUsers(users);
                            res.writeHead(200);
                            res.end(JSON.stringify(users[userIndex]));
                        }
                        else{
                            res.writeHead(404);
                            res.end(JSON.stringify({message: 'User not found'}));
                        }




            
                    })
               
                }





    }

})

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);  // console.log('Server is running on port 3000');  // console.log(`Server is running on http://localhost:${PORT}`);  // console.log(`Server is running on http://localhost:${PORT}`);  // console.log(`Server is running on http://localhost:${PORT}`);  // console.log(`Server is running on http://localhost:${PORT}`);  // console.log(`Server is running on http://localhost:${PORT}`);  // console.log(`Server is running on http://localhost:${PORT}`);  // console.log(`Server is running on http://localhost:${PORT}`);  // console.log(`Server is running on http://localhost:${PORT}`);  // console.log(`Server is running on http://localhost:${PORT}`);  // console.log(`Server is running on http://localhost:${PORT}`);  // console.log(`Server is running
}
)
