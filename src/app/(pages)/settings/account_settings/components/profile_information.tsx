"use client";

import { changeUserName } from "@/actions/users.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getAbbreviatedName } from "@/lib/utils";
import { PenLine } from "lucide-react";
import { User } from "next-auth";
import { useState } from "react";
import { toast } from "sonner";

export function ProfileInformation({ user }: { user: User }) {
  return (
    <section className="flex gap-6 md:gap-16 items-center">
      <Avatar className="size-16 md:size-32 rounded-2xl relative">
        <AvatarImage src={user.image ?? undefined} />
        <AvatarFallback className="text-2xl md:text-5xl">
          {getAbbreviatedName(user.name ?? undefined)}
        </AvatarFallback>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-1 right-1"
        >
          <PenLine className="size-3" />
          <p className="sr-only">Edit</p>
          {/* TODO: Edit for images is left; no storage location to store the images yet */}
        </Button>
      </Avatar>

      <section className="space-y-3 w-full">
        <section className="w-full flex justify-between items-center">
          <section>
            <p className="font-medium text-xs text-muted-foreground">Name</p>
            <p>{user?.name}</p>
          </section>
          <UpdateUsernameDialogTrigger
            name={user?.name ?? ""}
            email={user?.email ?? ""}
          />
        </section>
        <section>
          <p className="font-medium text-xs text-muted-foreground">Email</p>
          <p>{user?.email}</p>
        </section>
      </section>
    </section>
  );
}

function UpdateUsernameDialogTrigger({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [newName, setNewName] = useState<string>(name);
  const onClick = async () => {
    try {
      const res = await changeUserName(email, newName);
      toast.success("Username changed successfully");
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PenLine className="size-3" />
          <p className="text-xs">Edit</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Name</DialogTitle>
          <DialogDescription>
            Personalize your username.
            <br />
            You have to re-login to see the changes.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input
            placeholder="Enter New Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onClick}>Submit</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
