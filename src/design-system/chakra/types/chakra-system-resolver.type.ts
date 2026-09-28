export type TokenValue =
  | string
  | {
      base?: string;
      _dark?: string;
    };

export type TokenNode = {
  value?: TokenValue;
};
