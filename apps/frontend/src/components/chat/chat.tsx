import { SendHorizonal, Text } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { socket } from "@/socket/socket.manager";
import type { Player, SocketResponse } from "@/types";
import { handleSocketResponse } from "@/socket/socket.utils";
import { useSession } from "@/hooks/use-session";
import { Input } from "../ui/input";
import { useClickOutside } from "@/hooks/use-click-outside";

interface Chat {
	user: Player;
	message: string;
}

export const Chat = ({ roomId }: { roomId?: string }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [chats, setChats] = useState<Chat[]>([]);
	const [onOfUnreadMessages, setOnOfUnreadMessages] = useState(0);

	const chatContainerRef = useRef<HTMLDivElement>(null);
	const endOfMessagesRef = useRef<HTMLDivElement>(null);

	const ref = useClickOutside(() => {
		if (isOpen) {
			setIsOpen(false);
			setOnOfUnreadMessages(0);
		}
	});

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newMessage && roomId) {
			socket.emit("chat:message", { roomId, message: newMessage });
		}
	};

	useEffect(() => {
		const chatHandler = (data: SocketResponse<Chat>) => {
			handleSocketResponse(data, {
				onSuccess(data) {
					setChats((prev) => {
						const newChats =
							prev.length < 20 ? [...prev, data] : [...prev.slice(1), data];
						return newChats;
					});

					if (!isOpen) {
						setOnOfUnreadMessages((prev) => prev + 1);
					}
					endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
					setNewMessage("");
				},
				onError(error) {
					console.error("Error receiving chat message:", error);
				},
			});
		};

		socket.on("chat:message", chatHandler);

		return () => {
			socket.off("chat:message", chatHandler);
		};
	}, [isOpen]);

	useEffect(() => {
		if (chats.length > 0) {
			endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [chats.length]);

	useEffect(() => {
		if (isOpen) {
			endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
			setOnOfUnreadMessages(0);
		}
	}, [isOpen]);

	return (
		<div ref={ref} className="fixed bottom-4 right-4 z-50 font-play">
			<motion.div layoutId="chat"></motion.div>
			<div className="relative">
				<Button
					variant="outline"
					onClick={() => setIsOpen(!isOpen)}
					className="rounded-full p-3 shadow-lg transition-transform transform hover:scale-110 size-12"
				>
					<Text className="text-primary" />
				</Button>

				{onOfUnreadMessages > 0 && (
					<div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
						{onOfUnreadMessages > 9 ? "9+" : onOfUnreadMessages}
					</div>
				)}
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						ref={chatContainerRef}
						layoutId="chat"
						initial={{ opacity: 0, y: 20, x: "100%" }}
						animate={{ opacity: 1, y: 0, x: "0%" }}
						exit={{ opacity: 0, y: 20, x: "100%" }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="absolute bottom-16 right-0 w-md scrollbar-hide"
					>
						<Card>
							<CardContent>
								<div className="max-w-full h-64 overflow-y-auto mb-2 scrollbar-hide">
									{chats.map((chat, index) => (
										<ChatMessage key={index} chat={chat} />
									))}
									<div ref={endOfMessagesRef} />
								</div>

								<ChatForm
									onSubmit={onSubmit}
									newMessage={newMessage}
									setNewMessage={setNewMessage}
								/>
							</CardContent>
						</Card>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const ChatMessage = ({ chat }: { chat: Chat }) => {
	const { user } = useSession();
	const isMe = user?.id === chat.user.id;
	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			className={`flex items-start gap-2 mb-2 ${isMe ? "justify-end" : "justify-start"}`}
		>
			<div
				className={`p-2 rounded-lg max-w-[80%] ${isMe ? "bg-purple-600 text-white" : "bg-fuchsia-600"}`}
			>
				<p className="text-sm w-full break-words whitespace-pre-wrap">{chat.message}</p>
			</div>
		</motion.div>
	);
};

const ChatForm = ({
	onSubmit,
	newMessage,
	setNewMessage,
}: {
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	newMessage: string;
	setNewMessage: (message: string) => void;
}) => {
	return (
		<form className="relative" onSubmit={onSubmit}>
			<Input
				type="text"
				placeholder="Type a message"
				className="w-full pr-10 py-2"
				value={newMessage}
				onChange={(e) => setNewMessage(e.target.value)}
				max={50}
				autoFocus
			/>
			<Button
				className="absolute right-0 bottom-0"
				size="icon"
				variant="outline"
				type="submit"
			>
				<SendHorizonal />
			</Button>
		</form>
	);
};
