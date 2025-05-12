"use client";

import { useSession } from "@/providers/session-provider";
import { Coins, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const CoinsDisplay = () => {
    const router = useRouter();
	const { user } = useSession();

    // TODO: handle add coins
    const handleAddCoins = () => {
        router.push(`/store?type=coins`);
    };

	return (
		<div className="flex items-center bg-secondary ring-2 ring-primary/60 px-2 py-1 rounded-md text-primary gap-1">
			<span className="font-semibold text-xl">{user?.coins}</span>
			<Coins className="size-4 text-primary" />

			<button className="text-primary bg-primary p-1 rounded-sm border cursor-pointer ml-2" onClick={handleAddCoins}>
				<Plus className="size-4 text-white" />
			</button>
		</div>
	);
};
