'use client';
import { useState, useTransition } from 'react';
import Formsy from 'formsy-react';
import CustomInput from '@/components/CustomInput/customInput';
import FormsySelectInput from '@/components/CustomSelectInput/FormsySelectInput';
import SectionHeader from '@/components/SectionHeader/index';
import DateOnlyInput from '@/components/CustomDateInput/DateOnlyInput';
import { Button } from '@/components/ui/button';
import { create_task } from '@/action/task/create-task';
import { FormError } from '@/components/Messages/Error';
import { FormSuccess } from '@/components/Messages/Success';

interface TaskProps {
  title: string;
  description: string;
  dueDate: Date;
  priority: number;
}
const CreateTask = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tasks, setTasks] = useState([
    {
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 0,
    },
  ]);
  const items = [
    {
      title: 'First Priority',
      id: '1',
    },
    {
      title: 'High Priority',
      id: '2',
    },
    {
      title: 'Low Priority',
      id: '3',
    },
  ];
  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        title: '',
        description: '',
        dueDate: new Date(),
        priority: 0,
      },
    ]);
  };

  const onValidSubmit = () => {
    startTransition(() => {
      create_task(tasks).then((data) => {
        if (data.error) {
          setSuccess('');
          setError(data.error);
        }
        if (data.success) {
          setError('');
          setSuccess(data.success);
          setTasks([
            {
              title: '',
              description: '',
              dueDate: new Date(),
              priority: 0,
            },
          ]);
        }
      });
    });
  };
  return (
    <div className="flex justify-center flex-col items-center m-auto h-full mt-20 pb-32">
      <SectionHeader name="Create Task" />
      <Formsy
        className="bg-white shadow-3xl rounded-2xl p-10 w-1/2 mt-5"
        onValidSubmit={onValidSubmit}
      >
        {tasks.map((task, index) => (
          <div
            key={index}
            className="my-5 border-2 border-lightPink rounded-3xl p-3"
          >
            <CustomInput
              name="title"
              value={task.title}
              changeEvent={(e) => {
                const updatedTasks = [...tasks];
                updatedTasks[index]['title'] = e.target.value;
                setTasks(updatedTasks);
              }}
              placeholder="Finish Chapter"
              lable="Task Title"
              required
              disabled={isPending}
            />
            <CustomInput
              textArea
              name="description"
              placeholder="I will be completing..."
              value={task.description}
              lable="Task Description"
              changeEvent={(e) => {
                const updatedTasks = [...tasks];
                updatedTasks[index]['description'] = e.target.value;
                setTasks(updatedTasks);
              }}
              disabled={isPending}
            />
            <FormsySelectInput
              placeholder="Select Priority Level"
              lable="Task Priority"
              items={items}
              name="priority"
              onValueChange={(value: any) => {
                const updatedTasks = [...tasks];
                updatedTasks[index]['priority'] = parseInt(value);
                setTasks(updatedTasks);
              }}
              disabled={isPending}
            />
            <DateOnlyInput
              name="dueDate"
              value={task.dueDate}
              lable="Task Due Date"
              date={task.dueDate}
              setDate={(date: any) => {
                const updatedTasks = [...tasks];
                updatedTasks[index]['dueDate'] = date;
                setTasks(updatedTasks);
              }}
              disabled={isPending}
            />
            {/* <div className="m-auto bg-lighterPink rounded-2xl">
              <CreateSessionForm
                error={error}
                success={success}
                setError={setError}
              />
            </div> */}
            {/* <div className="flex justify-end">
              <Button type="button" className="move-button">
                Create Session
              </Button>
            </div> */}
          </div>
        ))}
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
        <div className="flex flex-col gap-2 mt-3">
          <Button
            className="move-button py-2 bg-lightPink"
            type="button"
            size={'slg'}
            onClick={handleAddTask}
          >
            Add Task
          </Button>
          <Button size={'slg'} className="move-button py-2" type="submit">
            {tasks.length > 1 ? ' Create Tasks' : ' Create Task'}
          </Button>
        </div>
      </Formsy>
    </div>
  );
};

export default CreateTask;