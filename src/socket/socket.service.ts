import { BadRequestException, Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { SocketGateway } from './gateway/socket.gateway';

@Injectable()
export class SocketService {
  public socket: Server = null;

}