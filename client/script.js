let sock = io.connect();

document.getElementById("sendAll").addEventListener("click", () => {
    let message = document.getElementById("content").value
    let username = document.getElementById("username").value;
    if (username != null) {
        document.getElementById("username").disabled = true
    }
    sock.emit('sendAll', ({user: username, message: message}));
});

document.getElementById("join").addEventListener("click", () => {
    let username = document.getElementById("username").value;
    document.getElementById("join").disabled = true;
    sock.emit('join', ({id: sock.id, user: username}));
});

document.getElementById("sendMe").addEventListener("click", () => {
    let message = document.getElementById("content").value
    let username = document.getElementById("username").value
    sock.emit('sendMe', ({user: username, message: message}));
});

target = document.getElementById("target")
sock.on('displayMessage', (data) => {
  //  console.log(data);

    target.innerHTML += `<br> <p class="username"> ${data.user} </p><p> ${data.message} </p>`;
});

userList = document.getElementById("userList")

sock.on('join', (allUsers) => {
  //  console.log(allUsers);
    userList.innerHTML = '';
    for (const user of allUsers) {
        userList.innerHTML += `<br> <ul><li class="list"> ${user.user} </li></ul>`;
    }
});
