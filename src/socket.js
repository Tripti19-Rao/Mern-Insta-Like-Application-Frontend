import  io  from 'socket.io-client'

export const socket = io('http://localhost:3060',{
                reconnection: true,
                autoConnect:false,
});

