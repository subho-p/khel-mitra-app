import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent, CardFooter } from "@/components/ui/8bit/card";
import { useSession } from "@/hooks/use-session";
import { useSignout } from "@/hooks/use-signout";

export default function ProfilePage() {
	const { onSignout } = useSignout();
	const { user } = useSession();

	const handleUpdateProfile = () => {};

	const handleChangePassword = () => {};

	return (
		<div className="flex w-full min-h-[100svh] flex-col items-center py-8 gap-8 px-4">
			<h1 className="text-2xl font-bold">Profile</h1>

			<Card className="w-full max-w-lg pt-8">
				<CardContent>
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between gap-4">
							<h2 className="text-base md:text-xl font-semibold md:font-bold">
								Name:
							</h2>
							<div className="flex items-center text-muted-foreground text-sm md:text-base">
								{user?.name ? <p>{user?.name}</p> : <p>Anonymous</p>}
							</div>
						</div>
						<div className="flex items-center justify-between gap-4">
							<h2 className="text-base md:text-xl font-semibold md:font-bold">
								Email:
							</h2>
							<p className="text-muted-foreground text-sm md:text-base">
								{user?.email}
							</p>
						</div>
						<div className="flex items-center justify-between gap-4">
							<h2 className="text-base md:text-xl font-semibold md:font-bold">
								Username:
							</h2>
							<p className="text-muted-foreground text-sm md:text-base">
								{user?.username}
							</p>
						</div>
						<div className="flex items-center justify-between gap-4">
							<h2 className="text-base md:text-xl font-semibold md:font-bold">
								Coins:
							</h2>
							<p className="text-purple-500 text-base md:text-xl">{user?.coins}</p>
						</div>
					</div>
				</CardContent>

				<CardFooter className="w-full flex flex-col items-end gap-8">
					<Button className="lg:w-1/2" variant="outline" onClick={handleUpdateProfile}>
						Update Profile
					</Button>
					<Button className="lg:w-1/2" variant="outline" onClick={handleChangePassword}>
						Change Password
					</Button>
					<Button variant="destructive" className="lg:w-1/2" onClick={onSignout}>
						Logout
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
