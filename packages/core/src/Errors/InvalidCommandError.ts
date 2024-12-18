type DeepKeyof<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${DeepKeyof<T[K]>}` | K
          : K
        : never;
    }[keyof T]
  : never;

export type CommandValidationError<I> = {
  field: DeepKeyof<I>;
  cue: string;
};

export class InvalidCommandError extends Error {
  constructor(
    message: string,
    public readonly errors: CommandValidationError<any>[]
  ) {
    super(message);
  }
}
