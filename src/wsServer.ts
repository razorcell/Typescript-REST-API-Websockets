process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import { WebSocketServer, WebSocket } from 'ws';
import { logger } from '@utils/logger';
import { CreateEventDto } from '@dtos/events.dto';
import { Event } from '@interfaces/events.interface';
import eventService from '@services/events.service';

declare interface SocketData {
  datetime: string;
  type: string;
  label: string;
}

export default class WsServer {
  private webSocketPort: number;
  private webSocketServer: WebSocketServer;
  public eventService = new eventService();

  constructor() {
    this.webSocketPort = parseInt(process.env.WBSOCK_PORT) || 3003;
    this.webSocketServer = new WebSocketServer({ port: this.webSocketPort });
  }

  public listen() {
    this.webSocketServer.on('connection', this.handleConnectionEvent);
    logger.info(`🚀 WebSocketServer Initialised ${this.webSocketPort}`);
  }

  public brodcast(msg: string, isBinary = false) {
    this.webSocketServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg, { binary: isBinary });
      }
    });
  }

  handleConnectionEvent = (ws: WebSocket, req) => {
    const ip = req.socket.remoteAddress;
    logger.info(`Client connected IP ${ip}`);
    ws.send('something');
    ws.on('message', this.handleScheduleEvent);
    // logger.info('received: ', data);
  };

  handleScheduleEvent = async (data: SocketData) => {
    try {
      logger.info(`Message received !`, data);
      // const stringData = ;
      const objectData = JSON.parse(data.toString());
      console.log(objectData);
      console.log(objectData.datetime);
      const eventData: CreateEventDto = data;
      const createEventData: Event = await this.eventService.createEvent(eventData);
      logger.info(`Event Created !`, createEventData);
    } catch (error) {
      logger.info(error);
    }
  };
}
