import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";

export const ServerIcon = ({
  server,
  onClick,
  isActive,
}: {
  server: { id: string; name: string };
  onClick: () => void;
  isActive: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-full transition-all ${isActive ? "h-12 w-12 rounded-lg" : "h-10 w-10"}`}
    >
      <Avatar className="h-full w-full cursor-pointer">
        <AvatarFallback className="bg-primary text-primary-foreground">
          {server.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </button>
  );
};

export const ServerIconSkeleton = () => (
  <Skeleton className="h-10 w-10 rounded-full" />
);
