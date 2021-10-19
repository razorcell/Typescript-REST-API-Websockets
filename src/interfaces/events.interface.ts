export interface Event {
  _id: string;
  processed: boolean;
  datetime: string | Date;
  label: string;
}
