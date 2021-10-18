process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import { WebSocketServer, WebSocket } from 'ws';
import { logger } from '@utils/logger';

export default class WsServer {
  private webSocketPort: number;
  private webSocketServer: WebSocketServer;

  constructor() {
    this.webSocketPort = parseInt(process.env.WBSOCK_PORT) || 3003;
    this.webSocketServer = new WebSocketServer({ port: this.webSocketPort });
  }

  public listen() {
    this.webSocketServer.on('connection', function connection(ws: WebSocket, req) {
      const ip = req.socket.remoteAddress;
      logger.info(`Client connected IP ${ip}`);
      ws.on('message', function incoming(message) {
        logger.info('received: %s', message);
      });
      ws.send('something');
    });
    logger.info(`🚀 WebSocketServer Initialised ${this.webSocketPort}`);
  }
}
