import { useServers } from "../hooks/use-server";
import { Button } from "./ui/button";

export const ServerList = ({
  onSelectServer,
}: {
  onSelectServer: (id: string) => void;
}) => {
  const { data: servers } = useServers();

  return (
    <div className="flex-1 overflow-y-auto">
      {servers?.map((server) => (
        <Button
          key={server.id}
          onClick={() => onSelectServer(server.id)}
          className="w-full p-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-blue-50"
        >
          <span className="font-medium">{server.name}</span>
        </Button>
      ))}
    </div>
  );
};
