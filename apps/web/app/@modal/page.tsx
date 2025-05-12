"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ModalLayout } from "./modal-layout";

export const dynamic = "force-dynamic";

export default function Page() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [search, setSearch] = useState<string>();

	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		if (searchParams.get("addCoins") === "true") {
			setSearch("addCoins");
			setOpenModal(true);
			router.replace(pathname);
		}
	}, [searchParams, router, pathname]);

	if (search === "addCoins") {
		return (
			<ModalLayout title="Add Coins" open={openModal} setOpen={setOpenModal}>
				<AddCoinsModal onChange={setOpenModal} />
			</ModalLayout>
		);
	}

	return null;
}

function AddCoinsModal({ onChange }: { onChange: (open: boolean) => void }) {
	return (
		<div>
			<h3>Are you sure you want to add coins?</h3>
			<button onClick={() => onChange(false)}>No</button>
			<button onClick={() => onChange(false)}>Yes</button>
		</div>
	);
}
