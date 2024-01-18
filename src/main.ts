import {WebSocketServer} from 'ws';

const ws = new WebSocketServer({port: 4000});

export interface Music {
    videoId: string;
    userName: string;
    musicName: string;
    [key: string]: any;
}

interface Room {
    code: string,
    musics: Music[]
}

const rooms: Room[] = [];

interface Message {
    action: 'registerRoom' | 'addMusic' | 'removeMusic';
    payload: any;
}

function registerRoom(roomCode: string) {
    if (rooms.findIndex( room => room.code === roomCode) !== -1) {
        return;
    }

    rooms.push({
        code: roomCode,
        musics: []
    });
}

function addMusic(code: string, music: Music) {
    const room = rooms.find(room => room.code === code);
  
    if (!room) {
        console.log("Room is not search");
    }
    
    if (room?.musics.findIndex(m => m.videoId === music.videoId) === -1) {
        room?.musics.push(music);
        console.log("Add new music", music)
    } else {
        console.log("music já está", music)
    }

}

function removeMusic(code: string, musicCode: string) {
    const room = rooms.find(room => room.code === code);

    if (room) {
        const position = room.musics.findIndex(mu => mu.videoId === musicCode);
        const removed = room.musics.splice(position, 1);
        console.log("Removed: ", removed);
    }
}
ws.on('connection', function (w) {
    w.on('error', console.error);
    w.on('message', (message: Buffer) => {
        const jsonMessage = JSON.parse(message.toString('utf8')) as Message;
        
        switch(jsonMessage.action) {
            case 'registerRoom': {
                registerRoom(jsonMessage.payload.code);
            } break;

            case 'addMusic': {
                addMusic(jsonMessage.payload.code, jsonMessage.payload.music);
            } break;

            case 'removeMusic': {
                removeMusic(jsonMessage.payload.code, jsonMessage.payload.music);
            } break;
        }

        ws.clients.forEach(client => client.send(JSON.stringify({
            action: 'roomUpdate',
            payload: rooms
        })))        
    });
});