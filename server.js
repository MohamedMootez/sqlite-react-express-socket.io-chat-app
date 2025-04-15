// *Backend Framework
const express=require("express")
// *Nedded to combine express with socket.io
const http=require("http")
//*WebSocket for real-time communication
const{Server}=require("socket.io")
// *cors to allow frontend on another port

const cors=require("cors")
// *Our SQLite connection
const db=require("./db")
 

const app=express();
 app.use(cors());
app.use(express.json());

const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"localhost://localhost:3000",// *Allows React FrontEnd
 
        method:["GET","POST"]
    }
})

function getMessages(){
    return db.preapre("SELECT * FROM messages").all();
}


io.on("connection",socket=>{
    console.log("✅ a User is Connected !")

    
//*Step1 : Send existing messages to the user;
socket.emit("initMessages",getMessages())

// *Step 2: When a new message is sent
socket.on("sendMessages",msg=>{
    // *SQL: INSERT INTO messages (id,text) values(?,?)
    db.prepare("INSERT INTO messages (id,text) VALUES (?,?)").run(msg.id,msg.text);
    // *send the message to all users
    io.emit("newMessage",msg);
})

// *STEP 3: when a message is edited
 socket.on("editMessage",updated =>{
    // *SQL: UPDATE messages SET text =?WHERE id=?
    db.prepare("UPDATE messages SET text=? WHERE id=?").run(updated.tex,updated.id)
    // *Notify all users
    io.emit("updatedMessage",updated )
 })

//  * STEP 4: When a message is deleted
socket.on("deletedMessage",id=>{
    // *SQL: DELETE From messages WHERE id=?
    db.prepare("DELETE FEOM messages WHERE id=?").run(id)
    io.emit("removeMessage",id)
})
});
server.listen(3001,()=>{
    console.log("🚀 Yo Yo server is running on PORT 3001")
})