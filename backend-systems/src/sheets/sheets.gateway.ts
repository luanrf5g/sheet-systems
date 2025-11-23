import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Sheet } from "@prisma/client";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  }
})

export class SheetsGateway {
  @WebSocketServer()
  server: Server;

  notifyAddedPlate(sheet: Sheet) {
    this.server.emit('AddedPlate', sheet)
  }

  notifyUpdatedPlate(sheet: Sheet) {
    this.server.emit('UpdatedPlate', sheet)
  }

  @SubscribeMessage('ping')
  handlePing(): string {
    return 'pong';
  }
}