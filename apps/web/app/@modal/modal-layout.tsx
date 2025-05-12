import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export function ModalLayout({
	children,
	open,
	setOpen,
	title,
	description,
}: {
	children: React.ReactNode;
	open: boolean;
	setOpen: (open: boolean) => void;
	title: string;
	description?: string;
}) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<DialogDescription>{description}</DialogDescription>
				{children}
			</DialogContent>
		</Dialog>
	);
}
