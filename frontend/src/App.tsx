import { useState } from "react";
import { ServerList } from "./components/ServerList";
import { ChannelView } from "./components/ChannelView";

function App() {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-muted">
      <div className="flex flex-col items-center py-4 w-15 bg-background border-r gap-2">
        <ServerList onSelectServer={setSelectedServer} />
      </div>
      {selectedServer && <ChannelView serverId={setSelectedServer} />}
    </div>
  );
}

export default App;
