import Kronash from '@kronash/core';
import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

const VanillaExample = () => {
  const createExample = () => {
    const kronash = new Kronash();

    kronash.subscribe((newState) => {
      console.log(newState);
    });

    const createTask = () => {
      const id = nanoid();

      const task = kronash.create({
        name: id,
        duration: 1000,
        onEnd: (task) => {
          toast.success(`Task ${task.name} ended`);
        },
      });

      task.start();
    };

    document
      .querySelector('#example button')
      ?.addEventListener('click', createTask);
  };

  useEffect(() => {
    createExample();
  }, []);

  return (
    <div id="example" className="pt-4">
      <button className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded">
        Create Task
      </button>
    </div>
  );
};

export default VanillaExample;
