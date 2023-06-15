import express from 'express';
import { createServer, Server } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
const server: Server = createServer(app);
const io: SocketServer = new SocketServer(server);
app.use(cors());

/* Change port for backend port switch */
const port = 4000;

/* Overall utilities */
let users: { username: string; id: string }[] = []; // Array to store connected users

/* Chatroom utilities */
const messages: { [key: string]: { sender: string; content: string }[] } = {
	general: [],
	random: [],
	jokes: [],
	javascript: []
};

let playerOneSocket: string, playerTwoSocket: string, audienceMemberSocket: string;
let playerOne: any, playerTwo: any;
let ballState: any;
let nextPlayerIndex = 1;
let userCount = 0;

io.on('connection', (socket: Socket) => {
	console.log('A user connected on the server');
	userCount++;
	console.log('Users online: ' + userCount);
	socket.emit('init', { 
		data: 'hello!' 
	});

	const playerIndex = nextPlayerIndex;
	console.log('New player index is: ' + playerIndex);
	nextPlayerIndex++;

	socket.on('join server', (playerName) => {
		console.log("Username in join server is: " + playerName);
		const user = {
			username: playerName,
			id: socket.id
		};
		users.push(user);
		io.emit('new user', users);
	});

	socket.on('join room', (roomName: string, cb: (messages: any[]) => void) => {
		socket.join(roomName);
		cb(messages[roomName]);
	});

	socket.on('update name', (username: string) => {
		const user = users.find(u => u.id === socket.id);
		if (user) {
			user.username = username;
		}
	});

	socket.on('send message', ({ content, to, sender, chatName, isChannel }) => {
		if (isChannel) {
			const payload = {
				content,
				chatName,
				sender
			};
			socket.to(to).emit('new message', payload);
		} else {
			const payload = {
				content,
				chatName: sender,
				sender
		};
		socket.to(to).emit('new message', payload);
		}
		if (messages[chatName]) {
			messages[chatName].push({
				sender,
				content
		});
		}
	});

// 

	socket.emit('playerIndex', playerIndex);
	io.sockets.emit('playerConnected', playerIndex);

	/* Joining game */
	socket.on('playerOneJoined', (playerOneId: string) => {
		console.log("Reached playerOneJoined");
		playerOneSocket = playerOneId;
		io.sockets.emit('playerOneAssign', playerOneSocket);
		io.sockets.emit('playerOneAssignArena', playerOneSocket);
	});

	socket.on('playerTwoJoined', (playerTwoId: string) => {
		console.log("Reached playerTwoJoined");
		playerTwoSocket = playerTwoId;
		io.sockets.emit('playerTwoAssign', playerTwoSocket);
		io.sockets.emit('playerTwoAssignArena', playerTwoSocket);
	});

	socket.on('audienceJoined', (audienceSocketId: string) => {
		audienceMemberSocket = audienceSocketId;
		io.sockets.emit('audienceAssign', audienceMemberSocket);
		io.sockets.emit('audienceAssignArena', audienceMemberSocket);
	});

	/* start game */
	/* socket.on('startGame', (ballDataStart: any) => {
		ballState = ballDataStart;
		
	}); */


	socket.on('playerOneUpdate', (playerOneData: any) => {
		playerOne = playerOneData;
		io.sockets.emit('playerOneState', playerOne);
	});
	
	socket.on('playerTwoUpdate', (playerTwoData: any) => {
		playerTwo = playerTwoData;
		io.sockets.emit('playerTwoState', playerTwo);
	});

	socket.on('playerOnePosition', (position: any) => {
		io.sockets.emit('playerOnePosition', position);
	});

	socket.on('updateBallPosition', (ballData: any) => {
		ballState = ballData;
		io.sockets.emit('ballState', ballState);
	});

	socket.on('playerOneScore', (playerOneScore: any) => {
		io.sockets.emit('playerOneScore', playerOneScore);
	});

	socket.on('playerTwoScore', (playerTwoScore: any) => {
		io.sockets.emit('playerTwoScore', playerTwoScore);
	});

	socket.on('playerTwoPosition', (position: any) => {
		io.sockets.emit('playerTwoPosition', position);
	});


//


		socket.on('disconnect', () => {
			console.log('A user disconnected');
			userCount--;
			users = users.filter(u => u.id !== socket.id);
			io.emit('new user', users);
			if (users.length === 0) {
			nextPlayerIndex = 1;
			}
			io.sockets.emit('playerDisconnected', playerIndex);
		});
});

server.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});