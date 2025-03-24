import { useState } from "react";
import { ServerList } from "./components/ServerList";
import { CreateServerForm } from "./components/CreateServerForm";
import { Separator } from "./components/ui/separator";
import { ScrollArea } from "@radix-ui/react-scroll-area";

function App() {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-col w-64 bg-white border-r">
        <div className="p-4 bg-gray-50 border-b">
          <CreateServerForm />
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <ServerList onSelectServer={setSelectedServer} />
        </ScrollArea>
      </div>
    </div>
  );
}

export default App;
