import { ServerSidebar } from "./components/ServerSidebar";
import { MessageInput } from "./components/MessageInput";
import { MessageList } from "./components/MessageList";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  return (
    <>
      <div className="flex h-screen bg-muted">
        <ServerSidebar onChannelSelect={setSelectedChannel} />
        <main className="flex-1 flex flex-col bg-white border-l">
          {selectedChannel ? (
            <>
              <div className="flex-1 overflow-hidden">
                <MessageList channelId={selectedChannel} />
              </div>
              <div className="border-t">
                <MessageInput channelId={selectedChannel} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a channel to start chatting
            </div>
          )}
        </main>
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
