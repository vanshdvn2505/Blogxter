import express from 'express'
import { Server } from 'socket.io'
import Message from './src/models/messages.js';

const participants = {};

const setUpChat = (io) => {

    io.on('connection', (socket) => {
        // console.log("Connected");

        socket.on('login', (userEmail) => {
            participants[userEmail] = socket.id;
            console.log(`User Logged In: ${userEmail}`)
        })

        socket.on('private', async ({id, content, sender, from, to}) => {
            const target = participants[to];
            const users = [from, to];
            const messageData = {
                id,
                users,
                chat: [{
                    content,
                    sender,
                    time: Date.now(),
                    // type: ,
                    // read: false
                }]
            }
            const data = {
                id,
                users,
                content,
                sender,
                time: Date.now()
            }
            try {
                const chatter = await Message.findOne({users : {$all: [from, to]}});

                if(!chatter){
                    const newMessage = new Message(messageData);
                    await newMessage.save();
                }
                else{
                    chatter.chat.push({
                        sender,
                        content,
                        time: Date.now(),
                    })
                    await chatter.save();
                }
                if(target){
                    socket.to(target).emit('receive', data)
                }
            } 
            catch(error){
                console.log(error);    
            }      
        })
    })
}

export default setUpChat;