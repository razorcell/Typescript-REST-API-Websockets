import { Agenda } from 'agenda/es';
import { logger } from '@utils/logger';
import eventService from '@services/events.service';
import { dbConnection } from '@databases';
import WsServer from '@/wsServer';

export default class Scheduler {
  private eventService = new eventService();
  private agenda: Agenda;
  private wsServer: WsServer;

  constructor(wsServer: WsServer) {
    this.agenda = new Agenda({ db: { address: dbConnection.url, collection: 'jobs' }, processEvery: '2 seconds', defaultLockLifetime: 1000 });
    this.wsServer = wsServer;
  }

  public async init() {
    await this.agenda.start();
    logger.info('Scheduler Started');
    await this.initAllTasks();
  }

  public async close() {
    await this.agenda.stop();
    logger.info('Scheduler Stopped');
  }

  public async initAllTasks() {
    await this.scheduleEventsCheck();
  }

  public async scheduleTask(frequency: string, taskName: string, taskFunction: Function) {
    try {
      await this.agenda.define(taskName, taskFunction);
      await this.agenda.every(frequency, taskName);
      logger.info(`Task [${taskName}] Freq [${frequency}] added`);
    } catch (error) {
      logger.error(error);
    }
  }

  public async scheduleEventsCheck() {
    await this.scheduleTask('3 seconds', 'checkEvents', async () => {
      logger.info('Task run');
      const dueEvents = await this.eventService.findDueEvents();
      logger.info(`Found [${dueEvents.length}] dueEvents`);
      await Promise.all(
        dueEvents.map(async dueEvent => {
          this.wsServer.brodcast(dueEvent.label, false);
          dueEvent.processed = true;
          await this.eventService.updateEvent(dueEvent._id, { processed: true });
        }),
      );
    });
  }
}
