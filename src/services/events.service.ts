import { CreateEventDto } from '@dtos/events.dto';
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
    if (!findEvent) throw new HttpException(409, "You're not user");

    return findEvent;
  }

  public async createEvent(userData: CreateEventDto): Promise<Event> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findEvent: Event = await this.events.findOne({ label: userData.label });
    if (findEvent) throw new HttpException(409, `Your label ${userData.label} already exists`);

    // const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createEventData: Event = await this.events.create({ ...userData });

    return createEventData;
  }

  // public async updateEvent(eventId: string, userData: CreateEventDto): Promise<Event> {
  //   if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

  //   if (userData.email) {
  //     const findEvent: Event = await this.events.findOne({ email: userData.email });
  //     if (findEvent && findEvent._id != eventId) throw new HttpException(409, `You're email ${userData.email} already exists`);
  //   }

  //   if (userData.password) {
  //     const hashedPassword = await bcrypt.hash(userData.password, 10);
  //     userData = { ...userData, password: hashedPassword };
  //   }

  //   const updateEventById: Event = await this.events.findByIdAndUpdate(eventId, { userData });
  //   if (!updateEventById) throw new HttpException(409, "You're not user");

  //   return updateEventById;
  // }

  public async deleteEvent(eventId: string): Promise<Event> {
    const deleteEventById: Event = await this.events.findByIdAndDelete(eventId);
    if (!deleteEventById) throw new HttpException(409, "You're not user");

    return deleteEventById;
  }
}

export default EventService;
