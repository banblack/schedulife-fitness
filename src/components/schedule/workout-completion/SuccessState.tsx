
import { Medal, ThumbsUp } from "lucide-react";

export function SuccessState() {
  return (
    <div className="py-12 flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
        <ThumbsUp className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-semibold text-center">Workout Completed!</h2>
      <p className="text-center text-muted-foreground">
        Great job! Your workout has been logged successfully.
      </p>
      <div className="flex items-center justify-center gap-2 mt-4">
        <Medal className="h-4 w-4 text-yellow-500" />
        <span className="text-sm">You're making excellent progress!</span>
      </div>
    </div>
  );
}
