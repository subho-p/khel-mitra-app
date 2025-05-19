"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { io, Socket } from "socket.io-client";
const socketUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL}`;
const socket = io(socketUrl, {
	transports: ["websocket"],
	reconnection: true,
	reconnectionAttempts: 5,
	reconnectionDelay: 1000,
	autoConnect: false,
	retries: 5,
});

export default function Test() {
	function checkHealth() {
		fetch(`${socketUrl}/health`).then((res) => console.log(res));
	}

	function clickConnect() {
		if (socket.connected) {
			socket.disconnect();
		} else {
			socket.connect();
		}
	}

	console.log("socket url", socketUrl);
	return (
		<div>
			Test
			<Button onClick={checkHealth}>Socket server health</Button>
			<Button onClick={clickConnect}>Connect socket</Button>
		</div>
	);
}
