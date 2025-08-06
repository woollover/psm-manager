export interface CommandRegistry {
  [key: string]: unknown;
}

export interface EventRegistry {
  [key: string]: unknown;
}

// try the4 as const and const (https://www.youtube.com/watch?v=6M9aZzm-kEc&ab_channel=MattPocock)

export type AllEventsNames = keyof EventRegistry;
export type AllCommandsNames = keyof CommandRegistry;
