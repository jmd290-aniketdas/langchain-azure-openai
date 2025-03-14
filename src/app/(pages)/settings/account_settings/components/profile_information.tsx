import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getAbbreviatedName } from "@/lib/utils";
import { Pen } from "lucide-react";
import { Session } from "next-auth";

export function ProfileInformation({session}: {session: Session}) {
  return (
    <section className="flex gap-6 md:gap-16 items-center">
      <Avatar className="size-16 md:size-32 rounded-2xl relative">
        <AvatarImage src={session?.user?.image ?? undefined} />
        <AvatarFallback className="text-2xl md:text-5xl">
          {getAbbreviatedName(session?.user?.name ?? undefined)}
        </AvatarFallback>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-1 right-1"
        >
          <Pen className="size-3" />
          <p className="sr-only">Edit</p>
        </Button>
      </Avatar>

      <section className="space-y-3 w-full">
        <section>
          <span className="w-full flex justify-between items-center">
            <p className="font-medium text-xs text-muted-foreground">Name</p>
            <Button variant="ghost" size="icon">
              <Pen className="size-3" />
              <p className="sr-only">Edit</p>
            </Button>
          </span>
          <p>{session?.user?.name}</p>
        </section>
        <section>
          <span className="w-full flex justify-between items-center">
            <p className="font-medium text-xs text-muted-foreground">Email</p>
            <Button variant="ghost" size="icon">
              <Pen className="size-3" />
              <p className="sr-only">Edit</p>
            </Button>
          </span>
          <p>{session?.user?.email}</p>
        </section>
      </section>
    </section>
  );
}
