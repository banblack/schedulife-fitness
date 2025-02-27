
import { Exercise } from "@/types/exercise";

export const exercises: Record<string, Exercise[]> = {
  volleyball: [
    { 
      name: "Vertical Jump Training", 
      sets: 4, 
      reps: "8-12", 
      equipment: "Box/Platform",
      type: "volleyball",
      difficulty: "intermediate",
      description: "Box jumps to improve vertical leap",
      muscleGroup: "legs"
    },
    { 
      name: "Shoulder Stability", 
      sets: 3, 
      reps: "12-15", 
      equipment: "Resistance Bands",
      type: "volleyball",
      difficulty: "beginner",
      description: "Band exercises for shoulder health",
      muscleGroup: "shoulders"
    },
    { 
      name: "Agility Drills", 
      sets: 3, 
      reps: "30s each", 
      equipment: "Cones",
      type: "volleyball",
      difficulty: "intermediate",
      description: "Quick feet and direction changes",
      muscleGroup: "full body"
    },
    { 
      name: "Explosive Power", 
      sets: 4, 
      reps: "6-8", 
      equipment: "Medicine Ball",
      type: "volleyball",
      difficulty: "advanced",
      description: "Medicine ball throws and slams",
      muscleGroup: "full body"
    },
    { 
      name: "Core Stability", 
      sets: 3, 
      reps: "15-20", 
      equipment: "Mat",
      type: "volleyball",
      difficulty: "beginner",
      description: "Planks and core exercises",
      muscleGroup: "core"
    }
  ],
  strength: [
    { 
      name: "Bench Press", 
      sets: 4, 
      reps: "8-12", 
      equipment: "Barbell",
      type: "strength",
      difficulty: "intermediate",
      description: "Classic chest press movement",
      muscleGroup: "chest"
    },
    { 
      name: "Squats", 
      sets: 4, 
      reps: "8-12", 
      equipment: "Barbell",
      type: "strength",
      difficulty: "intermediate",
      description: "Fundamental lower body exercise",
      muscleGroup: "legs"
    },
    { 
      name: "Deadlifts", 
      sets: 3, 
      reps: "8-10", 
      equipment: "Barbell",
      type: "strength",
      difficulty: "advanced",
      description: "Full body pulling movement",
      muscleGroup: "full body"
    },
    { 
      name: "Pull-ups", 
      sets: 3, 
      reps: "8-12", 
      equipment: "Pull-up Bar",
      type: "strength",
      difficulty: "intermediate",
      description: "Upper body pulling exercise",
      muscleGroup: "back"
    },
    { 
      name: "Overhead Press", 
      sets: 3, 
      reps: "8-12", 
      equipment: "Dumbbells/Barbell",
      type: "strength",
      difficulty: "intermediate",
      description: "Shoulder pressing movement",
      muscleGroup: "shoulders"
    }
  ],
  cardio: [
    { 
      name: "HIIT", 
      sets: 1, 
      reps: "20min", 
      equipment: "None",
      type: "cardio",
      difficulty: "intermediate",
      description: "High-intensity interval training",
      muscleGroup: "full body"
    },
    { 
      name: "Jump Rope", 
      sets: 3, 
      reps: "5min", 
      equipment: "Jump Rope",
      type: "cardio",
      difficulty: "beginner",
      description: "Cardiovascular conditioning",
      muscleGroup: "full body"
    },
    { 
      name: "Sprint Intervals", 
      sets: 5, 
      reps: "30s/30s", 
      equipment: "None",
      type: "cardio",
      difficulty: "advanced",
      description: "High-intensity running intervals",
      muscleGroup: "legs"
    },
    { 
      name: "Mountain Climbers", 
      sets: 3, 
      reps: "1 minute", 
      equipment: "None",
      type: "cardio",
      difficulty: "beginner",
      description: "Dynamic core and cardio exercise",
      muscleGroup: "full body"
    }
  ],
  mobility: [
    { 
      name: "Dynamic Stretching", 
      sets: 1, 
      reps: "10 each", 
      equipment: "None",
      type: "mobility",
      difficulty: "beginner",
      description: "Full body mobility routine",
      muscleGroup: "full body"
    },
    { 
      name: "Yoga Flow", 
      sets: 1, 
      reps: "20 min", 
      equipment: "Mat",
      type: "mobility",
      difficulty: "intermediate",
      description: "Flowing yoga sequence",
      muscleGroup: "full body"
    },
    { 
      name: "Joint Mobility", 
      sets: 2, 
      reps: "10 each joint", 
      equipment: "None",
      type: "mobility",
      difficulty: "beginner",
      description: "Joint circles and mobility work",
      muscleGroup: "full body"
    }
  ],
  plyometrics: [
    { 
      name: "Box Jumps", 
      sets: 4, 
      reps: "8-10", 
      equipment: "Plyo Box",
      type: "plyometrics",
      difficulty: "intermediate",
      description: "Explosive jumping exercise",
      muscleGroup: "legs"
    },
    { 
      name: "Depth Jumps", 
      sets: 3, 
      reps: "6-8", 
      equipment: "Box",
      type: "plyometrics",
      difficulty: "advanced",
      description: "Advanced jumping drill",
      muscleGroup: "legs"
    },
    { 
      name: "Medicine Ball Slams", 
      sets: 3, 
      reps: "10-12", 
      equipment: "Medicine Ball",
      type: "plyometrics",
      difficulty: "intermediate",
      description: "Explosive full body movement",
      muscleGroup: "full body"
    }
  ]
};
