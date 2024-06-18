const WebSocket = require("ws");

const clients = new Map(); // Map to store clients by session ID
const chatRooms = {};
let totalClients = 0;

function initWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    wss.getUniqueID = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4();
    };


    wss.on("connection", (ws) => {
        ws.uid = wss.getUniqueID();
        
        ws.send(JSON.stringify({
            "peerId": ws.uid,
            "uid": ws.uid
        }));
        totalClients++;
        console.log(`A client connected. Total clients: ${totalClients}`);
        
        ws.on('message', (message) => {
          try{
            // Parse message as JSON
            const data = JSON.parse(message)
            const { type, payload } = data;
            switch (type) {
                case 'join':
                    // Join chat room
                    joinChatRoom(ws, payload.room_id);
                    break;
                case 'message':
                    console.log('Received message:', payload);
                    // Broadcast message to chat room
                    broadcastToChatRoom(ws, payload);
                    break; 
                case 'online':         
                    console.log("online")
                    for(const room in chatRooms){
                      if(chatRooms[room].includes(ws)){
                        sendOnlineNotify(ws, room, payload.user_id)
                      }
                    }
                    break;
                case 'removeMember' : 
                    handleRemoveMember(ws,payload)
                default:
                    console.log('Unknown message type:', type);
            }
            wss.clients.forEach(function each(client) {
                console.log('Client.ID: ' + client.uid);
            });
          }catch(error){
            console.error('Error parsing message:', error);
          }
          
        });



        ws.on('close', () => {
            console.log('Client disconnected');
            totalClients -= 1;
            console.log("total clients: ", totalClients)
                // Remove client from all chat rooms
            leaveAllChatRooms();
        });
    });

    return wss;
}

function joinChatRoom(client, room_id) {
        // Create a new client entry if it doesn't exist
        clients.set(client);    

        // Create chat room if not exists
        if (!chatRooms[room_id]) {
            chatRooms[room_id] = [];
        }
        if (!chatRooms[room_id].includes(client)) {
            // Add client to chat room
            chatRooms[room_id].push(client);
        }else{
          console.log('Client already in room')
        }
        const members = chatRooms[room_id]
        members.forEach(mem => {
            if(mem !== client){
                mem.send(JSON.stringify({ "online" : true, "room_id": room_id }))
            }
        })
}

function broadcastToChatRoom(sender, payload) {
    // Ensure that message is an object and has the 'room' property
    console.log('payload' , payload)
    if (typeof payload === 'object' && payload.room_id && chatRooms[payload.room_id].includes(sender)) {
        const room = payload.room_id;
        const clientsInRoom = chatRooms[room];
        if (clientsInRoom) {
            // Broadcast message to all clients in the chat room
            clientsInRoom.forEach(client => {
                if (client !== sender && client.readyState === WebSocket.OPEN) {
                    // Stringify the message before sending it
                    client.send(JSON.stringify(payload));
                }
            });
        } else {
            console.log(`No clients in room ${room}`);
        }
    } else {
        console.log('Invalid message format:', payload);
    }
}

const sendOnlineNotify = async ((ws, room_id, user_id) => {
    const clients = chatRooms[room_id]
    clients.forEach(client => {
        if(client !== ws){
            client.send(JSON.stringify({ "online" : true, "room_id": room_id }))
        }
    })
})

const handleRemoveMember = async ((ws, payload) => {
    const { room_id, user_id } = payload;
    chatRooms[room_id] = chatRooms[room_id].filter(client => client.user_id != user_id)
})

function leaveAllChatRooms() {
    // Remove client from all chat rooms
    clients.forEach((client, key) => {
        clients.delete(client);
    });
}

module.exports = initWebSocketServer;
