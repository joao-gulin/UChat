export type Server = {
  id: string;
  name: string;
};

export type Channel = {
  id: string;
  name: string;
  serverId: string;
};

export type Message = {
  id: string;
  content: string;
  userId: string;
  channelId: string;
  createdAt: string;
};
