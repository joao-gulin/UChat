import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Receive() {
  const [receiveMessage, setReceiveMessage] = useState("");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setReceiveMessage(data.message);
    });
  }, [socket]);

  return (
    <div>
      <p>View Receive Message: {receiveMessage}</p>
    </div>
  );
}
