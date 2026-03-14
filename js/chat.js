const dbURL="https://whatsapp-chat-app-vj-default-rtdb.firebaseio.com";

const currentUser=localStorage.getItem("chatUser");

document.getElementById("myName").innerText=currentUser;

let selectedUser="";
let chatId="";

/* LOAD USERS */

function loadUsers(){

fetch(`${dbURL}/users.json`)
.then(res=>res.json())
.then(data=>{

let list=document.getElementById("userList");

list.innerHTML="";

if(!data) return;

for(let key in data){

let user=data[key].name;

if(user===currentUser) continue;

let li=document.createElement("li");

li.innerText=user;

if(user===selectedUser){
li.classList.add("active");
}

li.onclick=()=>openChat(user);

list.appendChild(li);

}

});

}

/* SEARCH USER */

function searchUser(){

let name=document.getElementById("searchUser").value;

if(name==="") return;

openChat(name);

}

/* OPEN CHAT */

function openChat(user){

selectedUser=user;

chatId=[currentUser,user].sort().join("_");

document.getElementById("chatTitle").innerText=
currentUser+" chatting with "+user;

loadMessages();

}

/* SEND MESSAGE */

function sendMessage(){

if(chatId===""){
showSnack("Select user first");
return;
}

let text=document.getElementById("msg").value;

if(text==="") return;

let msg={
user:currentUser,
text:text,
time:new Date().toLocaleTimeString()
};

fetch(`${dbURL}/chats/${chatId}.json`,{
method:"POST",
body:JSON.stringify(msg)
});

document.getElementById("msg").value="";

}

/* LOAD MESSAGES */

function loadMessages(){

if(chatId==="") return;

fetch(`${dbURL}/chats/${chatId}.json`)
.then(res=>res.json())
.then(data=>{

let chat=document.getElementById("chat");

chat.innerHTML="";

if(!data) return;

for(let key in data){

let m=data[key];

let div=document.createElement("div");

div.classList.add("msg");

if(m.user===currentUser){
div.classList.add("me");
}else{
div.classList.add("other");
}

div.innerHTML=`
<div class="text">${m.text}</div>

<div class="time">${m.time}</div>

<div class="actions">
<button onclick="editMsg('${key}')">✏</button>
<button onclick="deleteMsg('${key}')">🗑</button>
</div>
`;

chat.appendChild(div);

}

chat.scrollTop=chat.scrollHeight;

});

}

/* EDIT */

function editMsg(id){

let txt=prompt("Edit message");

if(!txt) return;

fetch(`${dbURL}/chats/${chatId}/${id}.json`,{
method:"PATCH",
body:JSON.stringify({text:txt})
});

}

/* DELETE */

function deleteMsg(id){

if(!confirm("Delete message?")) return;

fetch(`${dbURL}/chats/${chatId}/${id}.json`,{
method:"DELETE"
});

}

/* CLEAR */

function clearChat(){

if(!confirm("Clear chat?")) return;

fetch(`${dbURL}/chats/${chatId}.json`,{
method:"DELETE"
});

}

/* BACK */

function goBack(){

localStorage.removeItem("chatUser");

window.location="index.html";

}

/* SNACKBAR */

function showSnack(msg){

let x=document.getElementById("snackbar");

x.innerText=msg;

x.className="show";

setTimeout(()=>{
x.className="";
},3000);

}

/* AUTO REFRESH */

setInterval(loadUsers,2000);
setInterval(loadMessages,2000);