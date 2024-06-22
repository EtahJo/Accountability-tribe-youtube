'use client';

import React, { useTransition, useState } from 'react';
import * as z from 'zod';
import Formsy from 'formsy-react';

import { create_session } from '@/action/create-session';
import { CreateSessionSchema } from '@/schemas/index';
import CustomInput from '@/components/Custominput/index';
import CustomDateInput from '@/components/CustomDateInput';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/SectionHeader';
import { FaLink, FaCalendar, FaBaseballBall } from 'react-icons/fa';
import { FormError } from '@/components/Messages/Error';
import { FormSuccess } from '@/components/Messages/Success';
import Duration from '@/components/Duration';

const CreateSession = () => {
  const [isPending, startTransition] = useTransition();
  const [goal, setGoal] = useState('');
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();
  const [meetingLink, setMeetingLink] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const onValidSubmit = (vals: z.infer<typeof CreateSessionSchema>) => {
    startTransition(() => {
      create_session(vals)
        .then((data) => {
          if (data.error) {
            setSuccess('');
            setError(data.error);
          }
          if (data.success) {
            setError('');
            setSuccess(data.success);
          }
        })
        .catch((error) => {
          setSuccess('');
          setError('Something went wrong');
        });
    });
  };
  return (
    <div className=" flex flex-col h-screen items-center align-middle m-auto">
      <div className="m-auto">
        <div className="-mt-14 flex justify-center">
          <SectionHeader name="Create A Session" />
        </div>

        <Formsy
          onValidSubmit={onValidSubmit}
          className="flex justify-center flex-col items-center"
        >
          <div className=" bg-white rounded-5xl px-10 py-10 shadow-3xl my-10  md:w-[600px] w-[310px] ">
            <CustomInput
              lable="Session Goal"
              labelIcon={<FaBaseballBall className="text-purple" />}
              name="goal"
              value={goal}
              required
              textArea
              disabled={isPending}
              placeholder="What is the goal for this session ?"
              changeEvent={(e: React.ChangeEvent<HTMLInputElement>) => {
                setGoal((e.target as HTMLInputElement).value);
              }}
            />
            <CustomInput
              lable="Link to Scheduled Meeting"
              labelIcon={<FaLink className="text-purple" />}
              name="meetingLink"
              value={meetingLink}
              required
              disabled={isPending}
              changeEvent={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMeetingLink((e.target as HTMLInputElement).value);
              }}
              placeholder="Add link to meeting"
            />
          </div>
          <div
            className=" bg-white rounded-5xl px-10 py-10 shadow-3xl my-5 relative  flex justify-center 
           md:w-[600px] w-[310px] flex-col gap-5 "
          >
            {endDateTime && startDateTime && (
              <Duration
                startDateTime={startDateTime.toISOString()}
                endDateTime={endDateTime.toISOString()}
              />
            )}

            <CustomDateInput
              lable="Start and End Date and Time"
              labelIcon={<FaCalendar className="text-purple" />}
              className="w-[250px]"
              required
              name="startEndDateTime"
              value={{ startDateTime, endDateTime }}
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              disabled={isPending}
              onChangeStart={(date) => {
                setStartDateTime(date);
              }}
              onChangeEnd={(date) => setEndDateTime(date)}
            />

            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}
          </div>

          <div className="flex justify-center mt-5">
            <Button
              type="submit"
              className="rounded-3xl"
              disabled={isPending}
              size="lg"
              variant={'primary'}
            >
              Create Session
            </Button>
          </div>
        </Formsy>
      </div>
    </div>
  );
};

export default CreateSession;
