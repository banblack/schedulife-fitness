
import { workoutLogCore } from "./workoutLogCore";
import { workoutStatsService } from "./workoutStatsService";

export const workoutLogService = {
  ...workoutLogCore,
  ...workoutStatsService
};
