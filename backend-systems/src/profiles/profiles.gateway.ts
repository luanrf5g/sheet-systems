import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Tube } from "@prisma/client";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  }
})

export class ProfilesGateway {
  @WebSocketServer()
  server: Server;

  notifyAddedProfile(profile: Tube) {
    this.server.emit('AddedProfile', profile)
  }

  notifyUpdatedProfile(profile: Tube) {
    this.server.emit('UpdatedProfile', profile)
  }

  @SubscribeMessage('ping')
  handlePing(): string {
    return 'pong';
  }
}