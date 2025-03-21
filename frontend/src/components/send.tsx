import { useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Send() {
  const [message, setMessage] = useState("");
  const sendMessage = async () => {
    socket.emit("send_message", {
      senderId: "123",
      receiverId: "456",
      message: message,
    });
  };

  return (
    <div>
      <input onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>send message</button>
    </div>
  );
}
