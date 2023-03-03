import { OnModuleInit, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server, Socket} from "socket.io"
import { JwtGuard } from "src/@guards/jwt.guards";
import { JWT_SECRET } from "src/config";
import { User } from "src/users/entity/users.entity";
import { UsersService } from "src/users/users.service";
import { SocketService } from "../socket.service";






@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private socketService: SocketService,
        private jwtService: JwtService,
        private userService: UsersService
    ){}
    @WebSocketServer()
    public server: Server

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
            
            if(!decodedToken) {
                console.log("No decoded token");
                
                socket.disconnect();
            }

            console.log(decodedToken);
            

            //Get User
            const user = await this.userService.findById(decodedToken.sub);
            

            if(!user) {
                console.log("No user");
                
                socket.disconnect()
            };

            //associate user with that socket
            socket.data = {userId: user.id}

        } catch (error: any) {
            console.log(error);
            
            return socket.disconnect();
        }

      }

      async handleDisconnect(client: any) {
          
      }
    //Testing Purpose Only
    // @SubscribeMessage('newMessage')
    // onNewMessage(@MessageBody() payload: any) {
    //     this.server.emit('onMessage', {
    //         msg: 'New Message',
    //         content: payload
    //     })    
    //}

}