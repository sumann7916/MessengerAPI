import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';

@Injectable()
export class SocketService {
  public socket: Server = null;

}