export type rollData = {
  username: string;
  rolls: {
    rotation: { x: Number; y: Number; z: Number };
    force: Number;
  }[];
  timestamp: Date;
};

export type connectData = string[];

export type disconnectData = {
  username: string;
};

export type Message = {
  action: string;
  data: connectData | rollData | disconnectData;
};
