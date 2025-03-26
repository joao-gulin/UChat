import { ServerSidebar } from "./components/ServerSidebar";
import { MessageInput } from "./components/MessageInput";
import { useState } from "react";

function App() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-muted">
      <ServerSidebar onChannelSelect={setSelectedChannel} />
      <main className="flex-1 flex flex-col">
        <div className="flex-1">
          {/* Message list will go here */}
        </div>
        {selectedChannel && <MessageInput channelId={selectedChannel} />}
      </main>
    </div>
  );
}

export default App;
