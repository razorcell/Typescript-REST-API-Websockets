export interface Event {
  _id: string;
  processed: boolean;
  datetime: Date;
  description: string;
}