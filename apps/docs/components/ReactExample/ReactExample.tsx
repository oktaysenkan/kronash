import React from 'react';
import { useKronash } from '@kronash/react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

import Button from '../Button/Button';

const ReactExample = () => {
  const kronash = useKronash();

  const createSingleTask = () => {
    const id = nanoid();

    kronash.create({
      name: id,
      duration: 1000,
      onEnd: (task) => {
        toast.success(`Task ${task.name} ended`);
      },
    });
  };

  const createMultipleTask = () => {
    const id = nanoid();

    kronash.create({
      name: id,
      duration: 1000,
      repeatCount: 5,
      onTick(task) {
        toast.success(`Task ${task.name} ticked ${task.timesExecuted} times`);
      },
      onEnd: (task) => {
        toast.success(
          `Task ${task.name} ended, ticked ${task.timesExecuted} times`
        );
      },
    });
  };

  const createInfiniteTask = () => {
    const id = nanoid();

    kronash.create({
      name: id,
      duration: 1000,
      repeatCount: Infinity,
      onTick: (task) => {
        toast.success(`Task ${task.name} ticked ${task.timesExecuted} times`);
      },
    });
  };

  const startTask = (name: string) => {
    try {
      kronash.start(name);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const pauseTask = (name: string) => {
    try {
      kronash.pause(name);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const resumeTask = (name: string) => {
    try {
      kronash.resume(name);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const stopTask = (name: string) => {
    try {
      kronash.stop(name);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const deleteTask = (name: string) => {
    try {
      kronash.clear(name);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex pt-4 gap-2">
        <Button onClick={createSingleTask}>Create single task</Button>
        <Button onClick={createMultipleTask}>Create multiple task</Button>
        <Button onClick={createInfiniteTask}>Create infinite task</Button>
      </div>

      {kronash.tasks.length > 0 && (
        <div className="flex flex-col gap-5">
          {kronash.tasks.map((task) => (
            <div key={task.name} className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <div className="relative flex rounded border border-gray-500 p-4 gap-2 flex-wrap">
                  <span className="block nx-bg-white dark:nx-bg-dark absolute -top-2 left-2 text-xs px-2">
                    {task.name}
                  </span>

                  <span className="block nx-bg-white dark:nx-bg-dark absolute -top-2 right-2 text-xs px-2">
                    {task.status}
                  </span>

                  <Button onClick={() => startTask(task.name)}>Start</Button>
                  <Button onClick={() => pauseTask(task.name)}>Pause</Button>
                  <Button onClick={() => resumeTask(task.name)}>Resume</Button>
                  <Button onClick={() => stopTask(task.name)}>Stop</Button>
                  <Button onClick={() => deleteTask(task.name)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactExample;
