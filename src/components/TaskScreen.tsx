import React, { useState } from 'react';
import TaskItem from './TaskItem';
import Modal from 'react-modal';

interface Task {
  title: string;
  progress: string;
  points: number;
  isCompleted: boolean;
  description: string;
}

interface TaskScreenProps {
  onTaskComplete: (points: number) => void;
  referralCount: number;
  score: number;
}

const TaskScreen: React.FC<TaskScreenProps> = ({ onTaskComplete, referralCount, score }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      title: "Invite 5 friends",
      progress: `${referralCount} / 5`,
      points: 120,
      isCompleted: referralCount >= 5,
      description: "Invite 5 friends to join the platform and earn points.",
    },
    {
      title: "Farm 1,000 Storge",
      progress: `${score.toFixed(2)} / 1000.00`,
      points: 150,
      isCompleted: score >= 1000,
      description: "Accumulate 1,000 Storge coins to complete this task.",
    },
    {
      title: "Subscribe to Storge Telegram",
      progress: "0 / 1", // Example progress, update logic as needed
      points: 90,
      isCompleted: false, // Example task, update logic as needed
      description: "Subscribe to the Storge Telegram channel.",
    },
    // Add more tasks as needed
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = (task: Task) => {
    setSelectedTask(task);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedTask(null);
  };

  const verifyTask = () => {
    if (selectedTask) {
      const updatedTasks = tasks.map(task =>
        task.title === selectedTask.title ? { ...task, isCompleted: true } : task
      );
      setTasks(updatedTasks);
      closeModal();
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-500 to-indigo-800 text-white flex flex-col items-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-black">Available Tasks</h1>
          <p className="text-gray-600 text-sm">
            Complete tasks to earn points and rewards.
          </p>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <TaskItem
              key={index}
              title={task.title}
              progress={task.progress}
              points={task.points}
              description={task.description}
              isCompleted={task.isCompleted}
              onClick={() => {
                if (task.isCompleted) {
                  onTaskComplete(task.points);
                } else {
                  openModal(task);
                }
              }}
            />
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Verify Task"
          className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Verify Task</h2>
          {selectedTask && (
            <div>
              <p className="text-lg font-semibold">{selectedTask.title}</p>
              <p className="text-sm text-gray-600">{selectedTask.progress}</p>
              <p className="text-sm text-gray-600 mt-2">{selectedTask.description}</p>
              <button
                onClick={verifyTask}
                className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 transition duration-300 mt-4"
              >
                Verify Task
              </button>
            </div>
          )}
          <button
            onClick={closeModal}
            className="text-sm bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition duration-300 absolute top-2 right-2"
          >
            Close
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default TaskScreen;
