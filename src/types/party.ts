export interface PartyUser {
  users: string[];
  isStart: boolean;
  finalTime: number;
  count: number;
}

export type PartyRooms = {
  [key in string]?: PartyUser
}