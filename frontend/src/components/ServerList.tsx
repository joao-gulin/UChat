import { useServers } from "../hooks/use-server";
import { Button } from "./ui/button";

export const ServerList = ({
  onSelectServer,
}: {
  onSelectServer: (id: string) => void;
}) => {
  const { data: servers } = useServers();

  return (
    <div className="p-2 space-x-1">
      {servers?.map((server) => (
        <Button
          key={server.id}
          onClick={() => onSelectServer(server.id)}
          variant={"ghost"}
          className="w-full justify-start cursor-pointer"
        >
          <span className="truncate">{server.name}</span>
        </Button>
      ))}
    </div>
  );
};
