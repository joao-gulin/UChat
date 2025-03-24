import { Avatar, AvatarFallback } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { cn } from "../lib/utils"; // Make sure you have this utility

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
    <div className="flex justify-center mb-2">
      {" "}
      {/* Added container div */}
      <button
        onClick={onClick}
        className={cn(
          "relative rounded-full transition-all",
          "flex items-center justify-center", // Added flex centering
          isActive ? "h-12 w-12 rounded-lg" : "h-10 w-10 hover:rounded-lg",
          "mx-auto", // Ensure horizontal centering
        )}
      >
        <Avatar className="h-full w-full cursor-pointer border-2 border-background">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {server.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </button>
    </div>
  );
};

export const ServerIconSkeleton = () => (
  <div className="flex justify-center mb-4">
    {" "}
    {/* Consistent spacing */}
    <Skeleton className="h-10 w-10 rounded-full" />
  </div>
);
