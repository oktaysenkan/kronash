import { HandlerTask, Task, TaskHandler } from '../types';

class DefaultTaskHandler implements TaskHandler {
  private task: HandlerTask;

  constructor({ task }: { task: HandlerTask }) {
    this.task = task;
  }

  start() {
    if (this.task.status !== 'idle') {
      throw new Error('Task is not idle');
    }

    const startedAt = new Date().getTime();

    const timerId = setTimeout(
      () => this.onTaskEnd(this.task),
      this.task.duration
    );

    this.task = Object.assign(this.task, {
      timerId,
      startedAt,
      firstStartedAt: startedAt,
      status: 'running',
    });
  }

  private reexecute() {
    const isFinished = this.task.status === 'finished';

    const isSingleExecution =
      !this.task.repeatCount || this.task.repeatCount === 1;

    const isRunning = this.task.timesExecuted > (this.task.repeatCount || 0);

    if (!isFinished && !isSingleExecution && isRunning) {
      throw new Error('Task is not finished');
    }

    const startedAt = new Date().getTime();

    const timerId = setTimeout(
      () => this.onTaskEnd(this.task),
      this.task.duration
    );

    this.task = Object.assign(this.task, {
      timerId,
      startedAt,
      resumedAt: null,
      remainingTime: null,
      pausedAt: null,
      stoppedAt: null,
      status: 'running',
    });
  }

  pause() {
    if (this.task.status !== 'running') {
      throw new Error('Task is not running');
    }

    if (!this.task.timerId) {
      throw new Error('timerId not found');
    }

    if (!this.task.startedAt) {
      throw new Error('startedAt not found');
    }

    clearTimeout(this.task.timerId);

    const isPausedBefore = this.task.pausedAt;

    const duration = isPausedBefore
      ? this.task.remainingTime || 0
      : this.task.duration;

    const startedAt = this.task.resumedAt || this.task.startedAt;

    const pausedAt = new Date().getTime();

    const remainingTime = duration - (pausedAt - startedAt);

    this.task = Object.assign(this.task, {
      status: 'paused',
      timerId: null,
      pausedAt,
      remainingTime,
    });
  }

  resume() {
    if (this.task.status !== 'paused') {
      throw new Error('Task is not paused');
    }

    const duration = this.task.remainingTime || 0;

    const timerId = setTimeout(() => this.onTaskEnd(this.task), duration);

    const resumedAt = new Date().getTime();

    this.task = Object.assign(this.task, {
      status: 'running',
      timerId,
      resumedAt,
    });
  }

  stop() {
    if (this.task.status !== 'running') {
      throw new Error('Task is not running');
    }

    if (!this.task.timerId) {
      throw new Error('timerId not found');
    }

    clearTimeout(this.task.timerId);

    const stoppedAt = new Date().getTime();

    const startedAt = this.task.resumedAt || this.task.startedAt || 0;

    const duration = this.task.remainingTime || this.task.duration;

    const remainingTime = duration - (stoppedAt - startedAt);

    this.task = Object.assign(this.task, {
      ...this.task,
      status: 'stopped',
      timerId: null,
      stoppedAt,
      remainingTime,
    });
  }

  clear() {
    if (this.task.timerId) {
      clearTimeout(this.task.timerId);
    }
  }

  async onTaskEnd(_: HandlerTask) {
    if (!this.task.timerId) {
      throw new Error('timerId not found');
    }

    clearTimeout(this.task.timerId);

    this.task = Object.assign(this.task, {
      finishedAt: new Date().getTime(),
      remainingTime: 0,
      timesExecuted: this.task.timesExecuted + 1,
      timerId: null,
    });

    if (this.task.onTick) {
      await this.task.onTick(this.task as Task);
    }

    if (
      this.task.repeatCount &&
      this.task.repeatCount > this.task.timesExecuted
    ) {
      this.reexecute();
    }

    const isSingleExecution =
      !this.task.repeatCount || this.task.repeatCount === 1;

    const isLastExecution =
      !isSingleExecution && this.task.repeatCount === this.task.timesExecuted;

    if (isSingleExecution || isLastExecution) {
      this.task = Object.assign(this.task, {
        status: 'finished',
      });

      await this.task.onEnd?.(this.task as Task);
    }
  }
}

export default DefaultTaskHandler;
