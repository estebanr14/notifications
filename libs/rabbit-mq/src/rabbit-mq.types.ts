export interface MessageContract {
  type: 'COMMAND' | 'EVENT' | 'QUERY';
  name: string;
  payload: any;
  needsReply?: boolean;
}
