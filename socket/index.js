const io = require('socket.io')(8000, {
    cors: {
        origin: 'http://localhost:3000',
    }
})

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&//nếu users mới login vào trùng với user trong mảng users thì không thêm vào mảng users nguyên tắc là 1 user chỉ có 1 socketId duy nhất. Ngược lại thì thêm vào mảng users.
        users.push({ userId, socketId });

        console.log(users);
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
    //console.log(users)
    return users.find((user) => user.userId === userId);//090
}

io.on("connection", (socket) => {
    //when connection
    console.log("a user connected: ");
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);//thêm user vào mảng users
        io.emit("getUsers", users);//gửi mảng users cho client
    });

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        // console.log(senderId)
        // console.log(receiverId)
         console.log("text nhận: "+ text)
        const user = getUser(receiverId);//tham số receiverId là id của user nhận tin nhắn

        io.to(user.socketId).emit("getMessage", {//gửi tin nhắn đến user có socketId
            senderId,//07e
            text,//abc
        });
        // console.log(user)
        // console.log(user.socketId)
    });

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected");
        removeUser(socket.id);//xóa user khỏi mảng users
        io.emit("getUsers", users);//gửi mảng users cho client
    });
})