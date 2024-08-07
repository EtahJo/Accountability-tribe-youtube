import { getUserByUsername } from "@/data/user";
import { NextResponse, type NextRequest } from "next/server";
import {
	getAllUserSessions,
	getAllOngoingUserSessions,
	getAllEndedUserSessions,
	getAllUserSessionsThisWeek,
	getAllUserSessionsToday,
	getAllUserSessionsTomorrow,
} from "@/data/session";

export async function GET(req: NextRequest, context: any) {
	const { params } = context;
	const searchParams = req.nextUrl.searchParams;
	const pageString = searchParams.get("page");
	const page = parseInt(pageString as string, 10);

	const filter = searchParams.get("filter");

	try {
		const dbUser = await getUserByUsername(params.username);
		const perPage = 12;
		let sessions;
		sessions =
			filter === "ended"
				? await getAllEndedUserSessions(dbUser?.id as string, perPage, page)
				: filter === "ongoing"
					? await getAllOngoingUserSessions(dbUser?.id as string, perPage, page)
					: filter === "today"
						? await getAllUserSessionsToday(dbUser?.id as string, perPage, page)
						: filter === "thisWeek"
							? await getAllUserSessionsThisWeek(
									dbUser?.id as string,
									perPage,
									page,
								)
							: filter === "tomorrow"
								? await getAllUserSessionsTomorrow(
										dbUser?.id as string,
										perPage,
										page,
									)
								: await getAllUserSessions(dbUser?.id as string, perPage, page);

		if (!sessions?.sessions) {
			return NextResponse.json([]);
		}

		const returnValue = pageString
			? {
					sessions,
					hasMore: sessions.hasMore,
					totalPages: sessions.totalPages,
				}
			: sessions;
		return NextResponse.json(returnValue);
	} catch (error) {
		return NextResponse.json({ error });
	}
}
