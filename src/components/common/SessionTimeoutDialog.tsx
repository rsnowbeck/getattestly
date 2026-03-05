import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock } from "lucide-react";

interface SessionTimeoutDialogProps {
  open: boolean;
  remainingSeconds: number;
  onExtend: () => void;
}

export function SessionTimeoutDialog({ open, remainingSeconds, onExtend }: SessionTimeoutDialogProps) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            Session Expiring
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              For your security, your session will expire due to inactivity in{" "}
              <strong className="text-foreground font-mono">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </strong>
            </p>
            <p>
              Click below to continue working, or you'll be signed out automatically.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onExtend}>
            Continue Working
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
