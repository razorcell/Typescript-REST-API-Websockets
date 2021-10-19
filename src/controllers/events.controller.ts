import { NextFunction, Request, Response } from 'express';
import { CreateEventDto } from '@dtos/events.dto';
import { Event } from '@interfaces/events.interface';
import eventService from '@services/events.service';

class EventsController {
  public eventService = new eventService();

  public createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventData: CreateEventDto = req.body;
      const createEventData: Event = await this.eventService.createEvent(eventData);

      res.status(201).json({ data: createEventData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}

export default EventsController;
