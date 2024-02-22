import DefaultTaskHandler from "./handlers/default-task.handler";
import { CreateTaskOptions, KronashChain, KronashPlain, Task } from "./types";

class Kronash {
  #tasks: Record<string, Task> = {};
  private observers = new Set<(kronash: KronashPlain) => void>();

  constructor() {
    // TODO: Add options for throw error or return
  }

  subscribe(observer: (kronash: KronashPlain) => void) {
    this.observers.add(observer);

    return () => {
      this.unsubscribe(observer);
    };
  }

  unsubscribe(observer: (kronash: KronashPlain) => void) {
    this.observers.delete(observer);
  }

  notify(kronash: Kronash) {
    this.observers.forEach((observer) => {
      observer(kronash.toPlainObject());
    });
  }

  get tasks() {
    const tasksAsArray = Object.values({ ...this.#tasks }).map((task) => {
      const { handler, ...taskWithoutHandler } = task;

      return taskWithoutHandler;
    });

    return tasksAsArray;
  }

  create(options: CreateTaskOptions) {
    if (this.#tasks[options.name]) {
      throw new Error("Task already exists");
    }

    const onEndWrapper = () => {
      options.onEnd?.(this.#tasks[options.name]!);

      this.notify(this);
    };

    const onTickWrapper = () => {
      options.onTick?.(this.#tasks[options.name]!);

      this.notify(this);
    };

    const task: Omit<Task, "handler"> = {
      ...options,
      timerId: null,
      status: "idle",
      createdAt: new Date().getTime(),
      firstStartedAt: null,
      startedAt: null,
      resumedAt: null,
      stoppedAt: null,
      finishedAt: null,
      pausedAt: null,
      remainingTime: null,
      timesExecuted: 0,
      repeatCount: options.repeatCount || 1,
      onTick: options.onTick ? onTickWrapper : undefined,
      onEnd: options.onEnd ? onEndWrapper : undefined,
    };

    this.#tasks[options.name] = Object.assign(task, {
      handler: new DefaultTaskHandler({
        task,
      }),
    });

    this.notify(this);

    return this.chain(options.name);
  }

  async wait(duration: number) {
    await new Promise((resolve) => setTimeout(resolve, duration));
  }

  start(name: string) {
    this.checkTaskExists(name);

    this.#tasks[name]!.handler.start();

    this.notify(this);

    return this.chain(name);
  }

  startAll() {
    Object.values(this.#tasks)
      .filter((task) => task.status === "idle")
      .forEach((task) => task.handler.start());

    this.notify(this);
  }

  pause(name: string) {
    this.checkTaskExists(name);

    this.#tasks[name]!.handler.pause();

    this.notify(this);

    return this.chain(name);
  }

  pauseAll() {
    Object.values(this.#tasks)
      .filter((task) => task.status === "running")
      .forEach((task) => task.handler.pause());

    this.notify(this);
  }

  resume(name: string) {
    this.checkTaskExists(name);

    this.#tasks[name]!.handler.resume();

    this.notify(this);

    return this.chain(name);
  }

  resumeAll() {
    Object.values(this.#tasks)
      .filter((task) => task.status === "paused")
      .forEach((task) => task.handler.resume());

    this.notify(this);
  }

  stop(name: string) {
    this.checkTaskExists(name);

    this.#tasks[name]!.handler.stop();

    this.notify(this);

    return this.chain(name);
  }

  stopAll() {
    Object.values(this.#tasks)
      .filter((task) => task.status === "running")
      .forEach((task) => task.handler.stop());

    this.notify(this);
  }

  clear(name: string) {
    this.checkTaskExists(name);

    this.#tasks[name]!.handler.clear();

    delete this.#tasks[name];

    this.notify(this);

    return this.chain(name);
  }

  clearAll() {
    Object.values(this.#tasks).forEach((task) => task.handler.clear());

    this.#tasks = {};

    this.notify(this);
  }

  getTask(name: string) {
    this.checkTaskExists(name);

    return this.#tasks[name];
  }

  getRemainingTime(name: string) {
    this.checkTaskExists(name);

    return this.#tasks[name]!.remainingTime;
  }

  private checkTaskExists(name: string) {
    const hasExists = !!this.#tasks[name];

    if (!hasExists) {
      throw new Error("Task not found");
    }

    return hasExists;
  }

  private chain(name: string): KronashChain {
    return {
      start: () => this.start(name),
      pause: () => this.pause(name),
      resume: () => this.resume(name),
      stop: () => this.stop(name),
      clear: () => this.clear(name),
      getRemainingTime: () => this.getRemainingTime(name),
      getTask: () => this.getTask(name),
      wait: this.wait,
    };
  }

  toPlainObject(): KronashPlain {
    return {
      tasks: this.tasks,
      clear: (...args) => this.clear(...args),
      clearAll: (...args) => this.clearAll(...args),
      create: (...args) => this.create(...args),
      pause: (...args) => this.pause(...args),
      pauseAll: (...args) => this.pauseAll(...args),
      resume: (...args) => this.resume(...args),
      resumeAll: (...args) => this.resumeAll(...args),
      start: (...args) => this.start(...args),
      startAll: (...args) => this.startAll(...args),
      stop: (...args) => this.stop(...args),
      stopAll: (...args) => this.stopAll(...args),
      wait: (...args) => this.wait(...args),
      getRemainingTime: (...args) => this.getRemainingTime(...args),
      getTask: (...args) => this.getTask(...args),
    };
  }
}

export default Kronash;
