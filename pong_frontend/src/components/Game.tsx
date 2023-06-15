import React, { FC, useEffect, useRef } from 'react';

// let socket:any = null;

interface GameProps {
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	socket: any;
}

// function Game(props:any) {
	let playerIndex = 0, playerCount = 0;
	let ballGlobal = 0;
	let ballData = null;
	let playerOneId:string, playerTwoId:string, audienceId: string;
	let playerOne:any, playerTwo:any;
	let playerOneData, playerTwoData;
	let playerOneScore = 0, playerTwoScore = 0;
	
	let gamePixel = 10;
	
	const Game: FC<GameProps> = (props) => {
			const { canvasRef, socket } = props;
			const contextRef = useRef<CanvasRenderingContext2D | null>(null);


		socket.on('init', handleInit);
		socket.on('playerIndex', updatePlayerIndex);
		socket.on('playerConnected', playerConnected);
		socket.on('playerDisconnected', playerDisconnected);
		socket.on('playerOneState', playerOneUpdate);
		socket.on('playerTwoState', playerTwoUpdate);
		socket.on('playerOneScore', playerOneScoreUpdate);
		socket.on('playerTwoScore', playerTwoScoreUpdate);
		socket.on('ballState', updateBall);

		socket.on('playerOneAssign', playerOneIdInput);
		socket.on('playerTwoAssign', playerTwoIdInput);
		socket.on('audienceAssign', audienceIdInput);

		function playerOneIdInput(playerOneIdIn:string) {
			console.log("Reached playerOneIdInput");
			playerOneId = playerOneIdIn;
		}

		function playerTwoIdInput(playerTwoIdIn:string) {
			console.log("Reached playerTwoIdInput");
			playerTwoId = playerTwoIdIn;
		}

		function audienceIdInput(audienceIdIn:string) {
			audienceId = audienceIdIn;
		}

		function handleInit(msg:string) {
			console.log(msg);
		}

		function updatePlayerIndex(playerIndexNew:number) {
			playerIndex = playerIndexNew;
			//socket.emit('updatePlayerIndex', playerIndex);
		}

		function playerConnected(playerIndexConnect:number) {
			console.log("A player connected, currently the playerIndex is: " + playerIndex);
			/* if (playerIndexConnect === 1) {
				console.log("Player 1 connected");
			}
			if (playerIndexConnect === 2) {
				console.log("Player 2 connected");
			}
			else {
				console.log("Audience member connected");
			} */
		}

		function playerDisconnected(playerIndexDisc:number) {
			console.log("Player " + playerIndexDisc + " disconnected");
			playerCount--;
		}

		function playerCounter(playerCountNew:number) {
			playerCount = playerCountNew;
		}

		function playerOneUpdate(playerOneDataNew:any) {
			/* playerOne = playerOneDataNew; */
			try {
				playerOne = JSON.parse(playerOneDataNew);
				socket.emit('updatePlayerOne', playerOneDataNew);
			} catch (error) {
				console.error("Error parsing playerOneData:", error);
				console.log("playerOneData:", playerOneDataNew);
			}
		}

		function playerTwoUpdate(playerTwoDataNew:any) {
			/* playerTwo = playerTwoDataNew; */
			try {
				playerTwo = JSON.parse(playerTwoDataNew);
				socket.emit('updatePlayerTwo', playerTwoDataNew);
			} catch (error) {
				console.error("Error parsing playerTwoData:", error);
				console.log("playerTwoData:", playerTwoDataNew);
			}
		}

		function playerOneScoreUpdate(playerOneScoreNew:number) {
			playerOneScore = playerOneScoreNew;
		}

		function playerTwoScoreUpdate(playerTwoScoreNew:number) {
			playerTwoScore = playerTwoScoreNew;
		}

		function updateBall(ballState:any) {
			ballGlobal = JSON.parse(ballState);
			socket.emit('updateBall', ballState);
			/* ballGlobal = ballState; */
		}

		/* function updateGameState(gameStateChange) {
			gameState = gameStateChange;
		} */



		useEffect(() => 
		{
			const canvas = canvasRef.current;
			if (canvas) {
				const context = canvas.getContext('2d');
				contextRef.current = context; // Assign the 'context' value to the ref
			}
			const CHAR_PIXEL = 10;
			const CHARS = [
			'111101101101111', // 0
			'010010010010010',
			'111001111100111',
			'111001111001111',
			'101101111001001',
			'111100111001111',
			'111100111101111',
			'111001001001001',
			'111101111101111',
			'111101111001111' // 9
			].map(str => {
			const charCanvas = document.createElement('canvas');
			charCanvas.height = CHAR_PIXEL * 5;
			charCanvas.width = CHAR_PIXEL * 3;
			const charContext = charCanvas.getContext('2d');
			if (charContext) {
				charContext.fillStyle = '#fff';
			}
			str.split('').forEach((fill, i) => {
				if (fill === '1') {
					if (charContext) {
						charContext.fillRect(
							(i % 3) * CHAR_PIXEL,
							(i / 3 | 0) * CHAR_PIXEL,
							CHAR_PIXEL,
							CHAR_PIXEL
						);
					}
				}
			});
			return charCanvas;
			});

			class Vec {
				x: number;
				y: number;

				constructor(x:number = 0, y:number = 0) {
					this.x = x;
					this.y = y;
				}

				get len() {
					return Math.sqrt(this.x * this.x + this.y * this.y);
				}

				set len(value) {
					const fact = value / this.len;
					this.x *= fact;
					this.y *= fact;
				}
			}

			class Rect {
				pos: any;
				size: any;
				constructor(w:number, h:number) {
					this.pos = new Vec();
					this.size = new Vec(w, h);
				}
				get left() {
					return this.pos.x - this.size.x / 2;
				}
				get right() {
					return this.pos.x + this.size.x / 2;
				}
				get top() {
					return this.pos.y - this.size.y / 2;
				}
				get bottom() {
					return this.pos.y + this.size.y / 2;
				}
			}

			class Ball extends Rect {
				vel:any;
				pos:any;
				constructor() {
					super(gamePixel, gamePixel);
					this.vel = new Vec();
					this.pos = new Vec();
				}
			}

			class Player extends Rect {
				score: number;
				constructor(score:any) {
					super(gamePixel * 2, gamePixel * 10);
					this.score = score;
				}
			}

			class MiddleLine extends Rect {
				constructor() {
					super(gamePixel, gamePixel * 2);
				}
			}

			class Pong {
				_context:any;
				ball:any;
				lines:any;
				players:any[];

				constructor() {
					this._context = contextRef.current;
					this.players = [];
					//if (playerIndex === 0)
					this.ball = new Ball();
					ballGlobal = this.ball;
					//this.ball = null;
					//else
					//if (ballGlobal !== null)
					//	this.ball = ballGlobal;
					ballData = JSON.stringify(this.ball);
					socket.emit('updateBallPosition', ballData);

					/* Creates the middle line */
					let i, maxI;
					let lineHeight = gamePixel * 2;
					let startingPosition = 0;
					if (canvas) {
						maxI = canvas.height / (lineHeight * 2);
					}
					let lines = [];
					if (maxI && canvas) {
						for (i = 0; i <= maxI; i++) {
							lines.push(new MiddleLine());
							lines[i].pos.x = canvas.width / 2;
							lines[i].pos.y = startingPosition + (i * lineHeight * 2);
						}
					}
					this.lines = lines;

					/* Creates and places two players */
					console.log("PlayerIndex is " + playerIndex + " and playerId is: " + socket.id);
					console.log("PlayerOneId is " + playerOneId + " and playerTwoId is: " + playerTwoId);
					//if (playerTwo === undefined) {
						this.players = [
						new Player(0),
						new Player(0),
						];
						/* playerOne = this.players[0];
						playerTwo = this.players[1]; */
					/* } else {
						this.players[0] = playerOne;
						this.players[1] = playerTwo;
					} */
					
					if (canvas) {
						this.players[0].pos.x = gamePixel * 4;
						this.players[1].pos.x = canvas.width - this.players[1].size.x - (gamePixel * 4);
						this.players.forEach((player: Player) => {
							player.pos.y = (canvas.height - player.size.y) / 2;
						});
					}
					playerOne = this.players[0];
					playerTwo = this.players[1];

					playerOneData = JSON.stringify(playerOne);
					playerTwoData = JSON.stringify(playerTwo);
					socket.emit('playerOneUpdate', playerOneData);
					socket.emit('playerTwoUpdate', playerTwoData);
					
					let lastTime:any;
					const callback = (millis:any) => {
						if (lastTime) {
							this.update((millis - lastTime) / 1000);
						}
						lastTime = millis;
						requestAnimationFrame(callback);
					};

					this.start();

					callback(Date.now());
					}

					drawRect(rect:any) {
						this._context.fillStyle = '#fff';
						this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
					}
					
					collide(player:any, ball:any) {
						if (player.left < ball.right &&
								player.right > ball.left &&
								player.top < ball.bottom &&
								player.bottom > ball.top) {
							// const len = ball.vel.len;
							ball.vel.x = -ball.vel.x;
							ball.vel.y += 10 //* (Math.random() - 0.5);
							ball.vel.len *= 1.08;
						}
					}

					draw() {
						this._context.fillStyle = '#000';
						if (canvas) {
							this._context.fillRect(0, 0, canvas.width, canvas.height);
						}
						this.drawRect(this.ball);
						this.players.forEach((player:any) => this.drawRect(player));
					
						this.lines.forEach((line:any) => this.drawRect(line));
					
						this.drawScore();
					}
					
					drawScore() {
						if (canvas) {
							const align = canvas.width / 3;
							const CHAR_W = CHAR_PIXEL * 4;
							this.players.forEach((player:any, index:any) => {
								const chars = player.score.toString().split('');
								const offset =
									align *
									(index + 1) -
									CHAR_W * chars.length / 2 +
									CHAR_PIXEL / 2;
								chars.forEach((char:any, pos:any) => {
									this._context.drawImage(CHARS[char | 0], offset + pos * CHAR_W, (gamePixel * 2));
								});
							});
						}
					}
					
					/* Starts the game */
					start() {
						console.log("This player is " + socket.id);
						console.log("playerOneId is " + playerOneId);
						if (canvas && socket.id === playerOneId) {
							this.ball.pos.x = canvas.width / 2;
							this.ball.pos.y = canvas.height / 2;
							
							/* socket.emit('startGame', ballData); */
							
							
							//this.ball.vel.x = 0;
							//this.ball.vel.y = 0;
							
							//if (/* gameState === 1 && */ playerIndex === 2) {
								this.ball.vel.x = 150 * (Math.random() > 0.5 ? 1 : -1);
								this.ball.vel.y = 150 * (Math.random() * 2 - 1);
								this.ball.vel.len = 150;
								ballData = JSON.stringify(this.ball);
								socket.emit('updateBallPosition', ballData);
							//}
						}
					}

					/* Resets ball after scoring */
					reset() {
						if (canvas) {
							this.ball.pos.x = canvas.width / 2;
							this.ball.pos.y = canvas.height / 2;
							this.ball.vel.x = 0;
							this.ball.vel.y = 0;
						
							if (socket.id === playerOneId) {
								this.ball.vel.x = 150 * (Math.random() > 0.5 ? 1 : -1);
								this.ball.vel.y = 150 * (Math.random() * 2 - 1);
								this.ball.vel.len = 150;
								ballData = JSON.stringify(this.ball);
								socket.emit('updateBallPosition', ballData);
							}
						}
					}
					
					update(dt:any) {
						// First check, then change, then emit ball movement
						this.ball = ballGlobal;

						this.ball.pos.x += this.ball.vel.x * dt;
						this.ball.pos.y += this.ball.vel.y * dt;
						
						ballData = JSON.stringify(this.ball);
						socket.emit('updateBallPosition', ballData);
						ballGlobal = this.ball;

						/* Check if scores are correct */
						this.players[0].score = playerOneScore;
						this.players[1].score = playerTwoScore;
					
						if (canvas && (this.ball.left < 0 || this.ball.right > canvas.width)) {
							let playerId;
							if (this.ball.vel.x < 0)
								playerId = 1;
							else
								playerId = 0;
							this.players[playerId].score++;
							socket.emit('playerOneScore', this.players[0].score);
							socket.emit('playerTwoScore', this.players[1].score);
							this.reset();
						}
					
						if ( canvas && (
							this.ball.top < 0 ||
							this.ball.bottom > canvas.height)
						) {
							this.ball.vel.y = -this.ball.vel.y;
						}
						
						socket.on('playerOnePosition', (position:any) => {
							pong.players[0].pos.y = position;
							//console.log("Player 1 position changed");
						});

						socket.on('playerTwoPosition', (position:any) => {
							pong.players[1].pos.y = position;
							//console.log("Player 2 position changed");
						});
						
						this.players.forEach((player:Player) => this.collide(player, this.ball));

						/* Note to self: make AI work only if no player2 is connected */
						//if (playerCount === 1)
						// this.ai();

						this.draw();

						}
				}

				const pong = new Pong();

				/* new version for multiplayer mouse movement */
				if (canvas) {
					canvas.addEventListener('mousemove', event => {
						const rect = canvas.getBoundingClientRect();
						const scaleY = canvas.height / rect.height;
						const mouseY = (event.clientY - rect.top) * scaleY;
						//console.log("playerIndex is " + playerIndex);
						
						if (socket.id === playerOneId) {
							//console.log("Reached mouse movemenet 1");
							pong.players[0].pos.y = mouseY;
							socket.emit('playerOnePosition', pong.players[0].pos.y);
						}
						if (socket.id === playerTwoId) {
							//console.log("Reached mouse movemenet 2");
							pong.players[1].pos.y = mouseY;
							socket.emit('playerTwoPosition', pong.players[1].pos.y);
						}
						/* update player Data after movement */
						playerOneData = JSON.stringify(pong.players[0]);
						playerTwoData = JSON.stringify(pong.players[1]); 
						socket.emit('playerOneUpdate', playerOneData);
						socket.emit('playerTwoUpdate', playerTwoData);
					});

					// Cleanup function
					return () => {
						canvas.removeEventListener('mousemove', () => { });
					};
				}
			
		}, []);
			
		return <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} width={800} height={400} />;
	};
//}
export default Game;