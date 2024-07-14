import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface Task {
  id: number;
  description: string;
  reward: number;
  completed: boolean;
}

const tasksData: Task[] = [
  { id: 1, description: 'Invite a friend to the game', reward: 50, completed: false },
  { id: 2, description: 'Complete 5 taps on the coin', reward: 20, completed: false },
  { id: 3, description: 'Claim your reward 3 times', reward: 30, completed: false },
  { id: 4, description: 'Reach a score of 1000', reward: 40, completed: false },
];

interface TaskScreenProps {
  onBack: () => void;
  onTaskComplete: (reward: number) => void;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

const TaskScreen: React.FC<TaskScreenProps> = ({ onBack, onTaskComplete, balance, setBalance }) => {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const animatedBalance = useSpring({ from: { number: 0 }, number: balance, delay: 200 });

  const handleTaskComplete = (taskId: number) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: true } : task));
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      onTaskComplete(task.reward);
      setBalance(prevBalance => prevBalance + task.reward);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-500 to-indigo-800 text-white flex flex-col items-center p-6">
      <button 
        onClick={onBack} 
        className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 mb-6"
      >
        Back to Home
      </button>
      <div className="bg-white text-gray-900 rounded-lg shadow-md p-6 w-full max-w-6xl mb-6">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Main Balance: <animated.span>{animatedBalance.number.to(n => `$${n.toFixed(2)}`)}</animated.span>
        </h2>
        <h3 className="text-xl font-semibold mb-4 text-center">Tasks</h3>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tasks.map(task => (
            <li 
              key={task.id} 
              className={`flex flex-col justify-between p-4 rounded-lg shadow-sm ${task.completed ? 'bg-green-100' : 'bg-gray-100'}`}
            >
              <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-900'} mb-4`}>
                {task.description}
              </span>
              <button
                onClick={() => handleTaskComplete(task.id)}
                disabled={task.completed}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${task.completed ? 'bg-green-500 text-white cursor-default' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {task.completed ? 'Completed' : `Reward: $${task.reward}`}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskScreen;
