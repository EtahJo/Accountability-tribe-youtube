"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SessionFilter = () => {
	const searchParams = useSearchParams();
	const [selectedFilter, setSelectedFilter] = useState(
		searchParams.get("filter"),
	);
	const filters = [
		{
			text: "Upcoming",
			filter: "upcoming",
		},
		{
			text: "Ended",
			filter: "ended",
		},
		{
			text: "Ongoing",
			filter: "ongoing",
		},
		{
			text: "Today",
			filter: "today",
		},
		{
			text: "This Week",
			filter: "thisweek",
		},
		{
			text: "Tomorrow",
			filter: "tomorrow",
		},
	];
	return (
		<div
			className="flex items-center gap-2 my-3 flex-wrap 
    lg:justify-start justify-center"
		>
			{filters?.map(({ filter, text }, index) => (
				<Link href={`?page=1&filter=${filter}`} key={index}>
					<Button
						key={index}
						onClick={() => {
							setSelectedFilter(filter);
						}}
						className={cn(
							selectedFilter === filter ? "bg-purple dark:bg-dark-primary" : "bg-black",
							"transition-all",
						)}
					>
						{text}
					</Button>
				</Link>
			))}
		</div>
	);
};

export default SessionFilter;
