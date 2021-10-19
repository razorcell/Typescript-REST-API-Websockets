process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import WsServer from '@/wsServer';
import Scheduler from '@/scheduler';

import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import EventsRoute from '@routes/events.route';

import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), , new EventsRoute()]);

app.listen();

const wsServer = new WsServer();

wsServer.listen();

const scheduler = new Scheduler(wsServer);

scheduler.init();
