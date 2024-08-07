"use client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const GoogleLoginButton = () => {
	const onClick = () => {
		signIn("google", {
			callbackUrl: "/",
		});
	};
	return (
		<Button
			className="flex items-center gap-x-2 rounded-2xl move-button dark:border justify-center largePhone:flex-row flex-col"
			size={"slg"}
			onClick={onClick}
			type="button"
		>
			<FcGoogle size={25} />
			<p className="largePhone:text-xl text-lg text-center">Login with Google</p>
		</Button>
	);
};

export default GoogleLoginButton;
