import { CreateEventDto, UpdateEventDto } from '@dtos/events.dto';
import { HttpException } from '@exceptions/HttpException';
import { Event } from '@interfaces/events.interface';
import eventModel from '@models/events.model';
import { isEmpty } from '@utils/util';

class EventService {
  public events = eventModel;

  public async findAllEvent(): Promise<Event[]> {
    const events: Event[] = await this.events.find();
    return events;
  }

  public async findEventById(eventId: string): Promise<Event> {
    if (isEmpty(eventId)) throw new HttpException(400, "You're not eventId");

    const findEvent: Event = await this.events.findOne({ _id: eventId });
    if (!findEvent) throw new HttpException(409, "You're not event");

    return findEvent;
  }

  public async findDueEvents(): Promise<Event[]> {
    const dueEvents: Event[] = await this.events.find({ processed: false, datetime: { $lt: new Date() } });

    return dueEvents;
  }

  public async createEvent(eventData: CreateEventDto): Promise<Event> {
    if (isEmpty(eventData)) throw new HttpException(400, "You're not eventData");

    const findEvent: Event = await this.events.findOne({ label: eventData.label });
    if (findEvent) throw new HttpException(409, `Your label ${eventData.label} already exists`);

    const createEventData: Event = await this.events.create({ ...eventData });

    return createEventData;
  }

  public async updateEvent(eventId: string, eventData: UpdateEventDto): Promise<Event> {
    if (isEmpty(eventData)) throw new HttpException(400, "You're not eventData");

    if (eventData.label) {
      const findEvent: Event = await this.events.findOne({ label: eventData.label });
      if (findEvent && findEvent._id != eventId) throw new HttpException(409, `You're label ${eventData.label} already exists`);
    }

    const updateEventById: Event = await this.events.findByIdAndUpdate(eventId, { ...eventData }, { new: true });
    if (!updateEventById) throw new HttpException(409, "You're not event");

    return updateEventById;
  }

  public async deleteEvent(eventId: string): Promise<Event> {
    const deleteEventById: Event = await this.events.findByIdAndDelete(eventId);
    if (!deleteEventById) throw new HttpException(409, "You're not event");

    return deleteEventById;
  }
}

export default EventService;
