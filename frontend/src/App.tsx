import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const sendMessage = async () => {
    socket.emit("send_message", {
      senderId: "123",
      receiverId: "456",
      message: "Hello",
    });
  };
  return (
    <>
      <button onClick={sendMessage}>send message</button>
    </>
  );
}

export default App;
