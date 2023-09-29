import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import {
  PauseIcon,
  PlayIcon,
  ResumeIcon,
  StopIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { useKronash } from '@kronash/react';

import { Badge } from '../components/Badge/Badge';
import { Button } from '../components/Button/Button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/Table/Table';

const Router = () => {
  const kronash = useKronash();

  const handleCreateTask = async () => {
    const newTaskId = nanoid(8);

    kronash.create({
      name: newTaskId,
      duration: 5000,
      onEnd() {
        toast.success(`Task ${newTaskId} ended`);
      },
    });
  };

  const handleCreateTaskWithRepeatCount = async () => {
    const newTaskId = nanoid(8);

    kronash.create({
      name: newTaskId,
      duration: 2000,
      repeatCount: 5,
      onTick() {
        toast.success(`Task ${newTaskId} ticked`);
      },
      onEnd() {
        toast.success(`Task ${newTaskId} ended`);
      },
    });
  };

  const handleStartAllTasks = () => {
    try {
      kronash.startAll();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleStartTask = (name: string) => {
    try {
      kronash.start(name);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handlePauseAllTasks = async () => {
    try {
      kronash.pauseAll();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handlePauseTask = async (name: string) => {
    try {
      kronash.pause(name);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleResumeAllTasks = async () => {
    try {
      kronash.resumeAll();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleResumeTask = async (name: string) => {
    try {
      kronash.resume(name);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleStopTask = async (name: string) => {
    try {
      kronash.stop(name);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleStopAllTasks = async () => {
    try {
      kronash.stopAll();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleClearTask = async (name: string) => {
    try {
      kronash.clear(name);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleClearAllTasks = async () => {
    try {
      kronash.clearAll();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex mx-auto flex-col gap-10 container py-10">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        kronash Demo
      </h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <Button onClick={handleCreateTask}>Create task</Button>
          <Button onClick={handleCreateTaskWithRepeatCount}>
            Create task with repeat count
          </Button>
        </div>

        <div className="flex flex-row gap-2">
          <Button onClick={handleStartAllTasks}>Start all tasks</Button>
          <Button onClick={handlePauseAllTasks}>Pause all tasks</Button>
          <Button onClick={handleResumeAllTasks}>Resume all tasks</Button>
          <Button onClick={handleStopAllTasks}>Stop all tasks</Button>
          <Button onClick={handleClearAllTasks}>Clear all tasks</Button>
        </div>
      </div>

      <div className="mt-10">
        <Table>
          {kronash.tasks.length === 0 && (
            <TableCaption>A list of your tasks.</TableCaption>
          )}

          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Task Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Remaining Time</TableHead>
              <TableHead>Times Executed</TableHead>
              <TableHead>Repeat Count</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead className="text-right">Created At</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Object.values(kronash.tasks).map((task) => {
              return (
                <TableRow key={task.name}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell>
                    <Badge>
                      {task.status.replace(/^\w/, (c) => c.toUpperCase())}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.duration}</TableCell>
                  <TableCell>
                    {task.remainingTime !== null ? task.remainingTime : '-'}
                  </TableCell>
                  <TableCell>{task.timesExecuted}</TableCell>
                  <TableCell>{task.repeatCount}</TableCell>
                  <TableCell className="flex gap-2 w-36">
                    {task.status === 'running' && (
                      <Button
                        size={'icon'}
                        onClick={() => handlePauseTask(task.name)}
                      >
                        <PauseIcon className="w-5 h-5" />
                      </Button>
                    )}

                    {task.status === 'running' && (
                      <Button
                        size={'icon'}
                        onClick={() => handleStopTask(task.name)}
                      >
                        <StopIcon className="w-5 h-5" />
                      </Button>
                    )}

                    {task.status === 'idle' && (
                      <Button
                        size={'icon'}
                        onClick={() => handleStartTask(task.name)}
                      >
                        <PlayIcon className="w-5 h-5" />
                      </Button>
                    )}

                    {task.status === 'paused' && (
                      <Button
                        size={'icon'}
                        onClick={() => handleResumeTask(task.name)}
                      >
                        <ResumeIcon className="w-5 h-5" />
                      </Button>
                    )}

                    <Button
                      size={'icon'}
                      onClick={() => handleClearTask(task.name)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">{task.createdAt}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Router;
