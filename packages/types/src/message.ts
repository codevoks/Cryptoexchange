export const MessageType = {
  ORDERBOOK: "orderbook",
  TRADE: "trade",
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];