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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
