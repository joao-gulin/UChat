import { useState } from "react";

function App() {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-col w-64 bg-white border-r">
        <div className="p-4 bg-gray-50 border-b"></div>
      </div>
    </div>
  );
}

export default App;
