"use server";

import * as z from "zod";
import { CreateSessionSchema } from "@/schemas/index";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/authentication";
import { getUserById } from "@/data/user";
import { getDuration } from "@/util/DateTime";

export const create_session = async (
	values: z.infer<typeof CreateSessionSchema>,
) => {
	const validatedFields = CreateSessionSchema.safeParse(values);

	const errorMessage = validatedFields.error?.message
		.split(",")[2]
		.split(":")[1]
		.split('"')[1];

	if (!validatedFields.success) {
		return { error: errorMessage };
	}
	const { goal, startEndDateTime, meetingLink, taskIds } = validatedFields.data;
	const user = await currentUser();
	if (!user) {
		return { error: "Unauthorised access" };
	}
	const durationObj = getDuration(
		startEndDateTime.startDateTime.toISOString(),
		startEndDateTime.endDateTime.toISOString(),
	).hm;
	const duration = JSON.stringify(durationObj);
	const dbUser = await getUserById(user?.id as string);
	if (!dbUser) {
		return { error: "Unauthorised User" };
	}
	const session = await db.session.create({
		data: {
			goal,
			startDateTime: startEndDateTime.startDateTime,
			endDateTime: startEndDateTime.endDateTime,
			meetingLink,
			duration,
			adminUserId: dbUser.id,
		},
	});
	const sessionParticipant = await db.sessionParticipant.create({
		data: {
			user: { connect: { id: dbUser.id } },
			session: { connect: { id: session.id } },
			userRole: "ADMIN",
			goal,
			adminUserId: dbUser.id,
		},
	});
	await db.session.update({
		where: {
			id: session.id,
		},
		data: {
			participants: {
				increment: 1,
			},
		},
	});
	if (taskIds) {
		await db.$transaction(
			taskIds.map((taskId) =>
				db.sessionTask.create({
					data: {
						taskId: taskId.value,
						sessionParticipantId: sessionParticipant.id,
					},
				}),
			),
		);
	}

	return { success: "Session Created", creatorUsername: dbUser.username };
};
