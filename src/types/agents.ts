export interface AgentUser {
  username: string;
  agent: string;
  date: number;
  count: number;
}

export interface Agent {
  name: string;
}

export type AgentRooms = {
  [key in string]?: AgentUser[]
}