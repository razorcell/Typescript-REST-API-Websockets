import { Router } from 'express';
import EventsController from '@controllers/events.controller';
import { CreateEventDto } from '@dtos/events.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class EventsRoute implements Routes {
  public path = '/events';
  public router = Router();
  public eventsController = new EventsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get(`${this.path}`, this.eventsController.getEvents);
    // this.router.get(`${this.path}/:id`, this.eventsController.getEventById);
    this.router.post(`${this.path}`, validationMiddleware(CreateEventDto, 'body'), this.eventsController.createEvent);
    // this.router.put(`${this.path}/:id`, validationMiddleware(CreateEventDto, 'body', true), this.eventsController.updateEvent);
    // this.router.delete(`${this.path}/:id`, this.eventsController.deleteEvent);
  }
}

export default EventsRoute;
