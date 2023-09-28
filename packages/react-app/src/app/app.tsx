import { useKronash } from '@kronash/react';

export function App() {
  const kronos = useKronash();

  console.log(kronos);

  const handleCreate = () => {
    kronos
      .create({
        name: 'test',
        duration: 1000,
        onEnd: () => {
          window.document.body.style.backgroundColor = 'green';
        },
      })
      .start('test');
  };

  return (
    <div>
      <button onClick={handleCreate}>Create</button>

      {kronos.tasks.map((task) => (
        <div key={task.name}>
          <div>{task.name}</div>
          <div>{task.duration}</div>
          <div>{task.remainingTime}</div>
          <div>{task.status}</div>
        </div>
      ))}
    </div>
  );
}

export default App;
