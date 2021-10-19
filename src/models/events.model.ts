import { model, Schema, Document } from 'mongoose';
import { Event } from '@interfaces/events.interface';

const eventSchema: Schema = new Schema({
  processed: {
    type: Boolean,
    default: false,
  },
  datetime: {
    type: Date,
    default: Date.now,
  },
  label: {
    type: String,
    required: true,
  },
});

const eventModel = model<Event & Document>('Event', eventSchema);

export default eventModel;
