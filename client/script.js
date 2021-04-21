class User {
    constructor(id, username) {
        this.id = id;
        this.username = username;
    }
}

let sock = io.connect();
document.write("<a href='emojis.html'>Hlavní stránka</a><br>");

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
        //  console.log("test");
        userList.innerHTML += `<br><ul><li>online <p class="p" id="${user.id}">${user.username}</p></li></ul>`;
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
    target.innerHTML += '<marquee scrollamount="4" scrolldelay="8" ><p class="messageGeneral"><span class="username">' + data.user + '</span> -> ' + data.message + '</marquee><br> ';
    document.getElementById("target").scrollTop = document.getElementById("target").scrollHeight
});

//emojis
function injectEmojisToListContent(e) {
    document.getElementById("content").value += e.innerHTML;
}

// ------------ send private message ------------

document.getElementById("send").addEventListener("click", () => {
    let message = document.getElementById("privateMessage").value;
    let username = document.getElementById("username").value;
    let receiver = document.getElementById("receiverID").value;
    let receiverName = document.getElementById("receiverName").value;

    document.getElementById('privateMessage').value = '';
    privateMsg.innerHTML += '<p class="textBreak "><span class="username">' + 'you </span> -> <span class="message">' + receiverName + '</span>: ' + message + '</p><br>';
    sock.emit('private', ({username: username, receiver: receiver, receiverName: receiverName, message: message}));
});

privateMsg = document.getElementById("privateMsg")
sock.on("private", (data) => {
    // console.log(data);
    if (sock.id === data.receiver) {
        document.getElementById('privateMessage').value = '';
        privateMsg.innerHTML += '<p class="textBreak"><span class="username">' + data.username + '</span> -> <span class="message"> you </span>: ' + data.message + '</p>';
    }
    document.getElementById("privateMsg").scrollTop = document.getElementById("privateMsg").scrollHeight
});


