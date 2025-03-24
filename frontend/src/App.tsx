import { ServerSidebar } from "./components/ServerSidebar";

function App() {
  return (
    <div className="flex h-screen bg-muted">
      <ServerSidebar />
      <main className="flex-1"></main>
    </div>
  );
}

export default App;
