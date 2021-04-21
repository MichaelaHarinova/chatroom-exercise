class User {
    constructor(id, username) {
        this.id = id;
        this.username = username;
    }
}

let sock = io.connect();


//------------ user join ------------
document.getElementById("join").addEventListener("click", () => {
    let username = document.getElementById("username").value;
    document.getElementById("join").disabled = true;
    if (username != null) {
        document.getElementById("username").disabled = true;
        document.getElementById("sendAll").disabled = false;
        document.getElementById("sendMe").disabled = false;
        document.getElementById("send").disabled = false;
    }
    sock.emit('join', (new User(sock.id, username)));
});


//------------ list of online users ------------
userList = document.getElementById("userList")

sock.on('join', (allUsers) => {
    console.log(allUsers);
    userList.innerHTML = '';
    for (const user of allUsers) {
        console.log("test");
        userList.innerHTML += `<br><ul><li class="list">online <p id="${user.id}">${user.username}</p></li></ul>`;
        setTimeout(() => {
            document.getElementById(user.id).addEventListener("click", () => {
                document.getElementById("receiverName").value = user.username;
                document.getElementById("receiverID").value = user.id;
            })
        }, 1)
    }
});

//------------ send message to all ------------
document.getElementById("sendAll").addEventListener("click", () => {
    let message = document.getElementById("content").value
    let username = document.getElementById("username").value;

    sock.emit('sendAll', ({user: username, message: message}));
});

//------------ send message to me ------------
document.getElementById("sendMe").addEventListener("click", () => {
    let message = document.getElementById("content").value
    let username = document.getElementById("username").value
    sock.emit('sendMe', ({user: username, message: message}));
});

//------------ send general message display ------------
target = document.getElementById("target")
sock.on('displayMessage', (data) => {
    console.log(data);
    document.getElementById('content').value = '';
    target.innerHTML += '<br><marquee scrollamount="4" scrolldelay="8" ><p ><span class="username">' + data.username  + '</span> -> ' + data.message + '</marquee> ';
});

// ------------ send private message ------------

document.getElementById("send").addEventListener("click", () => {
    let message = document.getElementById("privateMessage").value;
    let username = document.getElementById("username").value;
    let receiver = document.getElementById("receiverID").value;

    document.getElementById('privateMessage').value = '';
    privateMsg.innerHTML += '<li><em><strong>' + username + ' -> </strong>: ' + message + '</em></li>';
    sock.emit('private', ({username: username, receiver: receiver, message: message}));
});

privateMsg = document.getElementById("privateMsg")
sock.on("private", (data) => {
    // console.log(data);
    if(sock.id === data.receiver){
        document.getElementById('privateMessage').value = '';
        privateMsg.innerHTML += '<li><em><strong>' + data.username + ' -> </strong>: ' + data.message + '</em></li>';
    }

});


