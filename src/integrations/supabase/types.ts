export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dynamic_achievements: {
        Row: {
          badge_data: Json
          condition: Json
          id: number
        }
        Insert: {
          badge_data: Json
          condition: Json
          id?: number
        }
        Update: {
          badge_data?: Json
          condition?: Json
          id?: number
        }
        Relationships: []
      }
      exercises: {
        Row: {
          difficulty: string | null
          equipment_needed: string[] | null
          id: number
          muscle_group: string
          name: string
          video_url: string | null
        }
        Insert: {
          difficulty?: string | null
          equipment_needed?: string[] | null
          id?: number
          muscle_group: string
          name: string
          video_url?: string | null
        }
        Update: {
          difficulty?: string | null
          equipment_needed?: string[] | null
          id?: number
          muscle_group?: string
          name?: string
          video_url?: string | null
        }
        Relationships: []
      }
      fitness_articles: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          image_url: string | null
          published: boolean | null
          title: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title?: string
        }
        Relationships: []
      }
      fitness_milestones: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          current_value: number | null
          description: string | null
          id: string
          target_value: number | null
          title: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          target_value?: number | null
          title: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          target_value?: number | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string | null
          status: string
          user_a: string
          user_b: string
        }
        Insert: {
          created_at?: string | null
          status?: string
          user_a: string
          user_b: string
        }
        Update: {
          created_at?: string | null
          status?: string
          user_a?: string
          user_b?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_user_a_fkey"
            columns: ["user_a"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_b_fkey"
            columns: ["user_b"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      league_teams: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          league_id: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          league_id?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          league_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "league_teams_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_date: string
          id: string
          is_public: boolean | null
          logo_url: string | null
          name: string
          start_date: string
          status: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_date: string
          id?: string
          is_public?: boolean | null
          logo_url?: string | null
          name: string
          start_date: string
          status?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string
          id?: string
          is_public?: boolean | null
          logo_url?: string | null
          name?: string
          start_date?: string
          status?: string | null
        }
        Relationships: []
      }
      routine_exercises: {
        Row: {
          created_at: string | null
          day_of_week: string
          id: string
          name: string
          reps: string
          routine_id: string | null
          sets: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week: string
          id?: string
          name: string
          reps: string
          routine_id?: string | null
          sets: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: string
          id?: string
          name?: string
          reps?: string
          routine_id?: string | null
          sets?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routine_exercises_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "workout_routines"
            referencedColumns: ["id"]
          },
        ]
      }
      sport_specific_workouts: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty: string | null
          id: string
          name: string
          sport: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          name: string
          sport: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          name?: string
          sport?: string
        }
        Relationships: []
      }
      sport_workout_exercises: {
        Row: {
          exercise_id: number
          notes: string | null
          reps: number
          sets: number
          sport_workout_id: string
        }
        Insert: {
          exercise_id: number
          notes?: string | null
          reps: number
          sets: number
          sport_workout_id: string
        }
        Update: {
          exercise_id?: number
          notes?: string | null
          reps?: number
          sets?: number
          sport_workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sport_workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sport_workout_exercises_sport_workout_id_fkey"
            columns: ["sport_workout_id"]
            isOneToOne: false
            referencedRelation: "sport_specific_workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: number
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: number
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: number
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "dynamic_achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_metrics: {
        Row: {
          created_at: string | null
          id: string
          metric_type: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_type: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_type?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_workout_stats: {
        Row: {
          created_at: string | null
          id: string
          last_workout_date: string | null
          streak_days: number | null
          total_workout_minutes: number | null
          updated_at: string | null
          user_id: string
          workouts_completed: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_workout_date?: string | null
          streak_days?: number | null
          total_workout_minutes?: number | null
          updated_at?: string | null
          user_id: string
          workouts_completed?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_workout_date?: string | null
          streak_days?: number | null
          total_workout_minutes?: number | null
          updated_at?: string | null
          user_id?: string
          workouts_completed?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          fitness_goals: string | null
          full_name: string | null
          height: number | null
          id: string
          is_admin: boolean | null
          updated_at: string | null
          username: string | null
          weight: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          fitness_goals?: string | null
          full_name?: string | null
          height?: number | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string | null
          username?: string | null
          weight?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          fitness_goals?: string | null
          full_name?: string | null
          height?: number | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string | null
          username?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          exercise_id: number
          reps: number
          sets: number
          workout_id: string
        }
        Insert: {
          exercise_id: number
          reps: number
          sets: number
          workout_id: string
        }
        Update: {
          exercise_id?: number
          reps?: number
          sets?: number
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_logs: {
        Row: {
          created_at: string | null
          date: string | null
          duration: number
          id: string
          intensity: number
          notes: string | null
          user_id: string | null
          workout_id: string
          workout_name: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          duration: number
          id?: string
          intensity: number
          notes?: string | null
          user_id?: string | null
          workout_id: string
          workout_name: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          duration?: number
          id?: string
          intensity?: number
          notes?: string | null
          user_id?: string | null
          workout_id?: string
          workout_name?: string
        }
        Relationships: []
      }
      workout_routines: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          completed: boolean
          created_at: string | null
          date: string
          duration: number
          exercises: Json
          id: string
          notes: string | null
          routine_id: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          date?: string
          duration: number
          exercises?: Json
          id?: string
          notes?: string | null
          routine_id?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          date?: string
          duration?: number
          exercises?: Json
          id?: string
          notes?: string | null
          routine_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "workout_routines"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          id: string
          notes: string | null
          user_id: string
          workout_date: string
        }
        Insert: {
          id?: string
          notes?: string | null
          user_id: string
          workout_date?: string
        }
        Update: {
          id?: string
          notes?: string | null
          user_id?: string
          workout_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      validate_workout_exercises: {
        Args: { exercises: Json }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
