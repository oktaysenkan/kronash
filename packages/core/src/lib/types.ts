export type Promiseable<T> = Promise<T> | T;

export type Task = {
  name: string;
  onTick?: () => Promiseable<void>;
  onEnd?: () => Promiseable<void>;
  duration: number;
  timerId: NodeJS.Timeout | null;
  status: "running" | "paused" | "stopped" | "idle" | "finished";
  createdAt: number;
  startedAt: number | null;
  resumedAt: number | null;
  stoppedAt: number | null;
  pausedAt: number | null;
  remainingTime: number | null;
  handler: TaskHandler;
  repeatCount?: number;
  timesExecuted: number;
};

export type HandlerTask = Omit<Task, "handler">;

export type CreateTaskOptions = Pick<
  Task,
  "repeatCount" | "name" | "duration" | "onTick" | "onEnd"
>;

export interface TaskHandler {
  start(): void;
  pause(): void;
  resume(): void;
  stop(): void;
  clear(): void;
  onTaskEnd(task: Task): void;
}
