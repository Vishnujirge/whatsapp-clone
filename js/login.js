const dbURL="https://whatsapp-chat-app-vj-default-rtdb.firebaseio.com";

function login(){

let name=document.getElementById("username").value;

if(name===""){
alert("Enter username");
return;
}

localStorage.setItem("chatUser",name);

fetch(`${dbURL}/users/${name}.json`,{
method:"PUT",
body:JSON.stringify({
name:name
})
});

window.location="chat.html";

}