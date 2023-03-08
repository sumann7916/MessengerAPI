import { BadRequestException, forwardRef, Inject, Injectable, OnModuleInit, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server, Socket} from "socket.io"
import { ChatService } from "src/chat/chat.service";
import { CreateMessageDto } from "src/chat/dto/message.dto";
import { JWT_SECRET } from "src/config";
import { User } from "src/users/entity/users.entity";
import { UsersService } from "src/users/users.service";
import { SocketService } from "../socket.service";

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // create an object to store the user ID and socket
  public userSockets = {};

  constructor(
    private socketService: SocketService,
    private jwtService: JwtService,
    private userService: UsersService,
    @Inject(forwardRef(()=>ChatService))
    private chatService: ChatService
  
  ) {}
  @WebSocketServer()
  public server: Server;

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  async handleConnection(socket: Socket) {
    //Only allow authenticated user to join connection
    try {
      if (!socket.handshake.headers.authorization) {
        // If the JWT token is not provided, disconnect the client
        console.log('JWT token not provided');
        socket.disconnect();
        return;
      }

      const decodedToken = await this.jwtService.verifyAsync(
        socket.handshake.headers.authorization.split(' ')[1],
        {
          secret: JWT_SECRET,
        },
      );

      if (!decodedToken) {
        console.log('No decoded token');

        socket.disconnect();
      }

      //Get User
      const user: User = await this.userService.findById(decodedToken.sub);

      if (!user) {
        socket.disconnect();
      }

      //associate user with that socket
      socket.data = { userId: user.id };

      //Store the users's socket in the object
      this.userSockets[user.id] = socket;
    } catch (error: any) {
      console.log(error);

      return socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    // remove the user's socket from the object when they disconnect
    if (socket.data && socket.data.userId) {
      delete this.userSockets[socket.data.userId];
    }
  }


  @SubscribeMessage('onMessage')
  async onSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: CreateMessageDto,
  ) {
     const message = await this.chatService.createMessage(socket.data.userId, payload)
      if(!message){
        throw new BadRequestException("Something went wrong")
      }
      if(message){
        const senderSocket = this.userSockets[message.sender.id];
        const recipientSocket = this.userSockets[payload.receiverId]
      
      senderSocket.emit('send-msg', {
        senderId: socket.data.userId,
        conversationId: message.conversation.id,
        message: message.content
      })
      if(recipientSocket){
        recipientSocket.emit("receive-msg", {
        senderId: socket.data.userId,
        conversationId: message.conversation.id,
        message: message.content
      })
    }
    }
  }

  }

