// src/design-system/chakra/types/chakra-system-resolver.type.ts

export type TokenValue =
  | string
  | {
      base?: string;
      _dark?: string;
    };

export type TokenNode = {
  value?: TokenValue;
};
