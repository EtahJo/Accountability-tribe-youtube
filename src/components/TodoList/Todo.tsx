'use client';
import { useState, useTransition } from 'react';
import { FaCheck } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/use-current-user';
import FullTextOnHover from '../FullTextOnHover/index';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/util/DateTime';
import { edit_task } from '@/action/edit-task';
import StatusUpdate from '@/components/TodoList/StatusUpdate';
import SessionModal from '@/components/TodoList/SessionModal';
import PriorityUpdate from '@/components/TodoList/PriorityUpdate';

interface TodoProps {
  taskTitle: string;
  priority: number;
  description: string;
  status: string;
  id: string;
  dueDate: string;
  taskId: string;
  sessionParticipants: {}[];
}
const Todo = ({
  taskTitle,
  priority,
  description,
  status,
  id,
  dueDate,
  sessionParticipants,
  taskId,
}: TodoProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { user }: any = useCurrentUser();
  return (
    <Accordion
      type="single"
      collapsible
      className={cn('bg-white rounded-2xl my-2 w-[320px] shadow-3xl mx-2 p-2')}
    >
      <AccordionItem value={id} className="border-b-0">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex gap-x-2 items-center">
            <div
              className="h-6 w-6 bg-transparent border-lightPink border-2 rounded-full flex items-center justify-center cursor-pointer "
              onClick={() => {
                setCompleted((prev) => !prev);
                if (status === 'COMPLETE') {
                  edit_task({ status: 'PROGRESS' }, taskId);
                } else {
                  edit_task({ status: 'COMPLETE' }, taskId);
                }
              }}
            >
              <FaCheck
                className={cn(
                  'text-purple m-auto',
                  status === 'COMPLETE' || completed ? 'block' : 'hidden'
                )}
              />
            </div>
            <div>
              <p className="font-bold text-lg text-start">{taskTitle}</p>
              <div className="flex items-center gap-2 ">
                <PriorityUpdate priority={priority} taskId={taskId} />
                <StatusUpdate status={status} taskId={taskId} />
              </div>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent
          className={cn(
            'bg-lighterPink mt-3 rounded-2xl p-2 flex items-center justify-between'
          )}
        >
          <div className=" flex flex-col gap-1">
            <FullTextOnHover
              text={description}
              textClassName="top-0"
              className="w-52"
            />

            <span className="flex">
              <p>Due: </p>
              <p className="text-purple font-bold">
                {formatDateTime(dueDate, user?.timezone).date}
              </p>
            </span>
          </div>
          <Badge
            className="whitespace-nowrap w-28 cursor-pointer pr-2"
            onClick={() => setIsOpenModal(true)}
          >
            In {sessionParticipants.length} Sessions
          </Badge>
        </AccordionContent>
      </AccordionItem>
      <SessionModal
        sessionParticipants={sessionParticipants}
        isOpen={isOpenModal}
        onRequestClose={() => setIsOpenModal(false)}
      />
    </Accordion>
  );
};

export default Todo;
