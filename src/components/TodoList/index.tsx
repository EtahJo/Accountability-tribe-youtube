'use client';
import SectionHeader from '@/components/SectionHeader';

import { FaPlusCircle } from 'react-icons/fa';
import Todo from '@/components/TodoList/Todo';

const TodoList = ({ tasks }: { tasks: {}[] }) => {
  return (
    <div>
      <SectionHeader
        name="Your Todo List"
        buttonLink="/create-task"
        buttonTitle="Create Task"
        buttonIcon={<FaPlusCircle size={20} className="text-lightPink" />}
      />
      <div className="flex flex-wrap my-5">
        {tasks?.map((task) => (
          <div>
            <Todo
              taskTitle={task.title}
              priority={task.priority}
              description={task.description}
              status={task.status}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
