"use client";
import PaginationController from "@/components/PaginationController";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import type { Task } from "@prisma/client";
import Achievement from "@/components/Achievements/Achievement";
import AchievementSkeleton from "@/components/Skeletons/AchievementSkeleton";
import UserAchievementsFilter from "./UserAchievementsFilter";
import NoData from "@/components/NoData";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const UserAchievementsBody = ({ username }: { username: string }) => {
	const searchParams = useSearchParams();
	let page = Number.parseInt(searchParams?.get("page") as string, 10);
	page = !page || page < 1 ? 1 : page;
	const filter = searchParams.get("filter") || "";
	const dateString = searchParams.get('date')||''
	const { data: completedTasks, isLoading } = useSWR(
		`${process.env.NEXT_PUBLIC_BASE_URL}/user/api/tasks/${username}/completed-task?page=${page}&filter=${filter}${dateString?'&date='+dateString:''}`,
		fetcher,
	);
	if (isLoading || completedTasks === undefined) {
		return (
			<div className="flex gap-2 flex-wrap">
				{Array.from({ length: 3 }).map((_, index) => (
					<AchievementSkeleton key={index} />
				))}
			</div>
		);
	}
	const { tasks, hasMore, totalPages } = completedTasks;
	return (
		<div>
			{
				tasks?.length===0?
				<NoData message="No Achievements"/>
				:
			<div className='mt-10 flex flex-col max-md:items-center'>
			<div className="flex gap-4 flex-wrap items-start max-md:flex-col max-md:items-center">
				<div
					className="flex items-center gap-1 bg-white p-3 rounded-2xl dark:bg-dark-lightBackground dark:border dark:border-slate-800
         shadow-3xl w-max"
				>
					<p className="uppercase text-lightPink dark:text-dark-primary">Total:</p>
					<p className="font-bold">{tasks.length}</p>
				</div>
				<UserAchievementsFilter />
			</div>
			<div className="flex flex-wrap gap-2 max-md:justify-center">
				{tasks?.map((task: Task) => (
					<Achievement
						key={task.id}
						taskTitle={task.title}
						dateCompleted={task.dateCompleted as any}
					/>
				))}
			</div>

			<PaginationController
				page={page}
				hasMore={hasMore}
				totalPages={totalPages}
				filter={filter}
			/>
		</div>
			}
		</div>
		
	);
};

export default UserAchievementsBody;
