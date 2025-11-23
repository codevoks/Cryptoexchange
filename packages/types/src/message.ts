export const MessageType = {
  ORDERBOOK: "orderbook",
  TRADE: "tradebook",
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];
