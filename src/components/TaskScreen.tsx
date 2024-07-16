import React from 'react';
import TaskItem from './TaskItem';

interface TaskScreenProps {
  onTaskComplete: (points: number) => void;
  referralCount: number;
}

const TaskScreen: React.FC<TaskScreenProps> = ({ onTaskComplete, referralCount }) => (
  <div className="relative min-h-screen bg-gradient-to-b from-blue-500 to-indigo-800 text-white flex flex-col items-center p-4">
    <div className="max-w-md mx-auto p-4">
      {/* Header */}
      <div className="text-center items-center justify-between mb-2">
        <h1 className="text-xl font-bold">Tasks available</h1>
        <p className="text-black text-xs mb-4">We’ll reward you immediately with points after each task completion.</p>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <TaskItem
          title="Invite 5 frens"
          progress={`${referralCount} / 5`}
          points="+ 120 STG"
          buttonText={referralCount >= 5 ? "Claim" : "Invite"}
          onClick={() => {
            if (referralCount >= 5) onTaskComplete(120);
          }}
        />
        <TaskItem
          title="Boost Storge"
          points="+ 200 STG"
          buttonText="Claim"
          onClick={() => onTaskComplete(200)}
        />
        {/* <TaskItem
          title="Thank you B"
          points="+ 200 STG"
          buttonText="Claim"
          onClick={() => onTaskComplete(200)}
        /> */}
        <TaskItem
          title="Farm Storge"
          progress="1,000.00"
          points="+ 150 STG"
          buttonText="Claim"
          onClick={() => onTaskComplete(150)}
        />
        <TaskItem
          title="Subscribe to Storge Telegram"
          points="+ 90 BP"
          buttonText="Claim"
          onClick={() => onTaskComplete(90)}
        />
      </div>
    </div>
  </div>
);

export default TaskScreen;
