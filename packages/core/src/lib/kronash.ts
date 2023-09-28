import DefaultTaskHandler from './handlers/default-task.handler';
import { CreateTaskOptions, Task } from './types';

class Kronash {
  #tasks: Record<string, Task> = {};
  private observers = new Set<(kronash: Kronash) => void>();

  constructor() {
    //
  }

  get tasks() {
    const tasksAsArray = Object.values({ ...this.#tasks });

    return tasksAsArray;
  }

  subscribe(observer: (kronash: Kronash) => void) {
    this.observers.add(observer);

    return () => {
      this.unsubscribe(observer);
    };
  }

  unsubscribe(observer: (kronash: Kronash) => void) {
    this.observers.delete(observer);
  }

  notify(kronash: Kronash) {
    this.observers.forEach((observer) => {
      observer(kronash);
    });
  }

  create(options: CreateTaskOptions) {
    if (this.#tasks[options.name]) {
      throw new Error('Task already exists');
    }

    const onEndWrapper = () => {
      options.onEnd?.();

      this.notify(this);
    };

    const onTickWrapper = () => {
      options.onTick?.();

      this.notify(this);
    };

    const task: Omit<Task, 'handler'> = {
      ...options,
      timerId: null,
      status: 'idle',
      createdAt: new Date().getTime(),
      startedAt: null,
      resumedAt: null,
      stoppedAt: null,
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

    return this;
  }

  async wait(duration: number) {
    await new Promise((resolve) => setTimeout(resolve, duration));
  }

  start(name: string) {
    if (!this.checkTaskExists(name)) {
      return this;
    }

    this.#tasks[name].handler.start();

    this.notify(this);

    return this;
  }

  startAll() {
    Object.values(this.#tasks)
      .filter((task) => task.status === 'idle')
      .forEach((task) => task.handler.start());

    this.notify(this);

    return this;
  }

  pause(name: string) {
    if (!this.checkTaskExists(name)) {
      return this;
    }

    this.#tasks[name].handler.pause();

    this.notify(this);

    return this;
  }

  pauseAll() {
    Object.values(this.#tasks)
      .filter((task) => task.status === 'running')
      .forEach((task) => task.handler.pause());

    this.notify(this);

    return this;
  }

  resume(name: string) {
    if (!this.checkTaskExists(name)) {
      return this;
    }

    this.#tasks[name].handler.resume();

    this.notify(this);

    return this;
  }

  resumeAll() {
    Object.values(this.#tasks)
      .filter((task) => task.status === 'paused')
      .forEach((task) => task.handler.resume());

    this.notify(this);

    return this;
  }

  stop(name: string) {
    if (!this.checkTaskExists(name)) {
      return this;
    }

    this.#tasks[name].handler.stop();

    this.notify(this);

    return this;
  }

  stopAll() {
    Object.values(this.#tasks)
      .filter((task) => task.status === 'running')
      .forEach((task) => task.handler.stop());

    this.notify(this);

    return this;
  }

  clear(name: string) {
    if (!this.checkTaskExists(name)) {
      return this;
    }

    this.#tasks[name].handler.clear();

    delete this.#tasks[name];

    this.notify(this);

    return this;
  }

  clearAll() {
    Object.values(this.#tasks).forEach((task) => task.handler.clear());

    this.#tasks = {};

    this.notify(this);

    return this;
  }

  getAll() {
    return { ...this.#tasks };
  }

  getTask(name: string) {
    if (!this.checkTaskExists(name)) {
      return this;
    }

    return this.#tasks[name];
  }

  getRemainingTime(name: string) {
    if (!this.checkTaskExists(name)) {
      throw new Error('Task not found');
    }

    return this.#tasks[name].remainingTime;
  }

  private checkTaskExists(name: string) {
    const hasExists = !!this.#tasks[name];

    if (!hasExists) {
      throw new Error('Task not found');
    }

    return hasExists;
  }
}

export default Kronash;
