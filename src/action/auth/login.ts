"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas/index";
import { getUserByEmail } from "@/data/user";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
export const login = async (
	values: z.infer<typeof LoginSchema>,
	callbackUrl?: string | null,
) => {
	const validatedFields = LoginSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: "Invalid fields" };
	}
	const { email, password, remember } = validatedFields.data;
	const existingUser = await getUserByEmail(email);

	if (!existingUser) {
		return { error: "User does not exist!" };
	}

	// TODO : check for email verification
	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
		});
		return { success: "Success" };
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credential" };
				default:
					return { error: "Something went wrong" };
			}
		}
		throw error;
	}
};
