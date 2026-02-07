// export type Json =
//   | string
//   | number
//   | boolean
//   | null
//   | { [key: string]: Json | undefined }
//   | Json[]

// export type Database = {
//   // Allows to automatically instantiate createClient with right options
//   // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
//   __InternalSupabase: {
//     PostgrestVersion: "14.1"
//   }
//   public: {
//     Tables: {
//       attendance: {
//         Row: {
//           check_in_time: string
//           gym_id: string
//           id: string
//           member_id: string
//           method: Database["public"]["Enums"]["attendance_method"]
//         }
//         Insert: {
//           check_in_time?: string
//           gym_id: string
//           id?: string
//           member_id: string
//           method?: Database["public"]["Enums"]["attendance_method"]
//         }
//         Update: {
//           check_in_time?: string
//           gym_id?: string
//           id?: string
//           member_id?: string
//           method?: Database["public"]["Enums"]["attendance_method"]
//         }
//         Relationships: [
//           {
//             foreignKeyName: "attendance_gym_id_fkey"
//             columns: ["gym_id"]
//             isOneToOne: false
//             referencedRelation: "gyms"
//             referencedColumns: ["id"]
//           },
//           {
//             foreignKeyName: "attendance_member_id_fkey"
//             columns: ["member_id"]
//             isOneToOne: false
//             referencedRelation: "gym_members"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//       diet_plans: {
//         Row: {
//           created_at: string
//           created_by: string | null
//           gym_id: string
//           id: string
//           is_free: boolean
//           member_id: string | null
//           plan_data: Json
//           updated_at: string
//           week_start_date: string
//         }
//         Insert: {
//           created_at?: string
//           created_by?: string | null
//           gym_id: string
//           id?: string
//           is_free?: boolean
//           member_id?: string | null
//           plan_data?: Json
//           updated_at?: string
//           week_start_date: string
//         }
//         Update: {
//           created_at?: string
//           created_by?: string | null
//           gym_id?: string
//           id?: string
//           is_free?: boolean
//           member_id?: string | null
//           plan_data?: Json
//           updated_at?: string
//           week_start_date?: string
//         }
//         Relationships: [
//           {
//             foreignKeyName: "diet_plans_gym_id_fkey"
//             columns: ["gym_id"]
//             isOneToOne: false
//             referencedRelation: "gyms"
//             referencedColumns: ["id"]
//           },
//           {
//             foreignKeyName: "diet_plans_member_id_fkey"
//             columns: ["member_id"]
//             isOneToOne: false
//             referencedRelation: "gym_members"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//       gym_members: {
//         Row: {
//           assigned_trainer_id: string | null
//           created_at: string
//           end_date: string | null
//           gym_id: string
//           id: string
//           membership_type: Database["public"]["Enums"]["membership_type"]
//           start_date: string
//           updated_at: string
//           user_id: string
//         }
//         Insert: {
//           assigned_trainer_id?: string | null
//           created_at?: string
//           end_date?: string | null
//           gym_id: string
//           id?: string
//           membership_type?: Database["public"]["Enums"]["membership_type"]
//           start_date?: string
//           updated_at?: string
//           user_id: string
//         }
//         Update: {
//           assigned_trainer_id?: string | null
//           created_at?: string
//           end_date?: string | null
//           gym_id?: string
//           id?: string
//           membership_type?: Database["public"]["Enums"]["membership_type"]
//           start_date?: string
//           updated_at?: string
//           user_id?: string
//         }
//         Relationships: [
//           {
//             foreignKeyName: "gym_members_gym_id_fkey"
//             columns: ["gym_id"]
//             isOneToOne: false
//             referencedRelation: "gyms"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//       gym_trainers: {
//         Row: {
//           created_at: string
//           gym_id: string
//           id: string
//           specialization: string | null
//           updated_at: string
//           user_id: string
//         }
//         Insert: {
//           created_at?: string
//           gym_id: string
//           id?: string
//           specialization?: string | null
//           updated_at?: string
//           user_id: string
//         }
//         Update: {
//           created_at?: string
//           gym_id?: string
//           id?: string
//           specialization?: string | null
//           updated_at?: string
//           user_id?: string
//         }
//         Relationships: [
//           {
//             foreignKeyName: "gym_trainers_gym_id_fkey"
//             columns: ["gym_id"]
//             isOneToOne: false
//             referencedRelation: "gyms"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//       gyms: {
//         Row: {
//           address: string
//           city: string
//           contact_number: string
//           created_at: string
//           gpay_qr: string | null
//           gym_images: string[] | null
//           id: string
//           is_active: boolean
//           name: string
//           owner_id: string
//           phonepe_qr: string | null
//           updated_at: string
//         }
//         Insert: {
//           address: string
//           city: string
//           contact_number: string
//           created_at?: string
//           gpay_qr?: string | null
//           gym_images?: string[] | null
//           id?: string
//           is_active?: boolean
//           name: string
//           owner_id: string
//           phonepe_qr?: string | null
//           updated_at?: string
//         }
//         Update: {
//           address?: string
//           city?: string
//           contact_number?: string
//           created_at?: string
//           gpay_qr?: string | null
//           gym_images?: string[] | null
//           id?: string
//           is_active?: boolean
//           name?: string
//           owner_id?: string
//           phonepe_qr?: string | null
//           updated_at?: string
//         }
//         Relationships: []
//       }
//       notifications: {
//         Row: {
//           created_at: string
//           gym_id: string
//           id: string
//           is_read: boolean
//           message: string
//           title: string
//           type: string
//           user_id: string | null
//         }
//         Insert: {
//           created_at?: string
//           gym_id: string
//           id?: string
//           is_read?: boolean
//           message: string
//           title: string
//           type?: string
//           user_id?: string | null
//         }
//         Update: {
//           created_at?: string
//           gym_id?: string
//           id?: string
//           is_read?: boolean
//           message?: string
//           title?: string
//           type?: string
//           user_id?: string | null
//         }
//         Relationships: [
//           {
//             foreignKeyName: "notifications_gym_id_fkey"
//             columns: ["gym_id"]
//             isOneToOne: false
//             referencedRelation: "gyms"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//       payments: {
//         Row: {
//           amount: number
//           created_at: string
//           gym_id: string
//           id: string
//           member_id: string
//           payment_date: string
//           payment_method: Database["public"]["Enums"]["payment_method"]
//           status: Database["public"]["Enums"]["payment_status"]
//         }
//         Insert: {
//           amount: number
//           created_at?: string
//           gym_id: string
//           id?: string
//           member_id: string
//           payment_date?: string
//           payment_method: Database["public"]["Enums"]["payment_method"]
//           status?: Database["public"]["Enums"]["payment_status"]
//         }
//         Update: {
//           amount?: number
//           created_at?: string
//           gym_id?: string
//           id?: string
//           member_id?: string
//           payment_date?: string
//           payment_method?: Database["public"]["Enums"]["payment_method"]
//           status?: Database["public"]["Enums"]["payment_status"]
//         }
//         Relationships: [
//           {
//             foreignKeyName: "payments_gym_id_fkey"
//             columns: ["gym_id"]
//             isOneToOne: false
//             referencedRelation: "gyms"
//             referencedColumns: ["id"]
//           },
//           {
//             foreignKeyName: "payments_member_id_fkey"
//             columns: ["member_id"]
//             isOneToOne: false
//             referencedRelation: "gym_members"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//       profiles: {
//         Row: {
//           avatar_url: string | null
//           city: string
//           created_at: string
//           date_of_birth: string | null
//           email: string | null
//           full_name: string
//           gender: string | null
//           id: string
//           mobile_number: string
//           updated_at: string
//           user_id: string
//         }
//         Insert: {
//           avatar_url?: string | null
//           city: string
//           created_at?: string
//           date_of_birth?: string | null
//           email?: string | null
//           full_name: string
//           gender?: string | null
//           id?: string
//           mobile_number: string
//           updated_at?: string
//           user_id: string
//         }
//         Update: {
//           avatar_url?: string | null
//           city?: string
//           created_at?: string
//           date_of_birth?: string | null
//           email?: string | null
//           full_name?: string
//           gender?: string | null
//           id?: string
//           mobile_number?: string
//           updated_at?: string
//           user_id?: string
//         }
//         Relationships: []
//       }
//       user_roles: {
//         Row: {
//           created_at: string
//           id: string
//           role: Database["public"]["Enums"]["app_role"]
//           user_id: string
//         }
//         Insert: {
//           created_at?: string
//           id?: string
//           role: Database["public"]["Enums"]["app_role"]
//           user_id: string
//         }
//         Update: {
//           created_at?: string
//           id?: string
//           role?: Database["public"]["Enums"]["app_role"]
//           user_id?: string
//         }
//         Relationships: []
//       }
//       workout_plans: {
//         Row: {
//           created_at: string
//           created_by: string | null
//           gym_id: string
//           id: string
//           member_id: string
//           plan_data: Json
//           updated_at: string
//           week_start_date: string
//         }
//         Insert: {
//           created_at?: string
//           created_by?: string | null
//           gym_id: string
//           id?: string
//           member_id: string
//           plan_data?: Json
//           updated_at?: string
//           week_start_date: string
//         }
//         Update: {
//           created_at?: string
//           created_by?: string | null
//           gym_id?: string
//           id?: string
//           member_id?: string
//           plan_data?: Json
//           updated_at?: string
//           week_start_date?: string
//         }
//         Relationships: [
//           {
//             foreignKeyName: "workout_plans_gym_id_fkey"
//             columns: ["gym_id"]
//             isOneToOne: false
//             referencedRelation: "gyms"
//             referencedColumns: ["id"]
//           },
//           {
//             foreignKeyName: "workout_plans_member_id_fkey"
//             columns: ["member_id"]
//             isOneToOne: false
//             referencedRelation: "gym_members"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//     }
//     Views: {
//       [_ in never]: never
//     }
//     Functions: {
//       get_user_role: {
//         Args: { _user_id: string }
//         Returns: Database["public"]["Enums"]["app_role"]
//       }
//       has_role: {
//         Args: {
//           _role: Database["public"]["Enums"]["app_role"]
//           _user_id: string
//         }
//         Returns: boolean
//       }
//     }
//     Enums: {
//       app_role: "owner" | "trainer" | "member"
//       attendance_method: "qr" | "manual"
//       membership_type: "free" | "paid" | "personal"
//       payment_method: "gpay" | "phonepe" | "cash"
//       payment_status: "pending" | "completed" | "failed"
//     }
//     CompositeTypes: {
//       [_ in never]: never
//     }
//   }
// }

// type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

// type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

// export type Tables<
//   DefaultSchemaTableNameOrOptions extends
//     | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
//     | { schema: keyof DatabaseWithoutInternals },
//   TableName extends DefaultSchemaTableNameOrOptions extends {
//     schema: keyof DatabaseWithoutInternals
//   }
//     ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
//         DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
//     : never = never,
// > = DefaultSchemaTableNameOrOptions extends {
//   schema: keyof DatabaseWithoutInternals
// }
//   ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
//       DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
//       Row: infer R
//     }
//     ? R
//     : never
//   : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
//         DefaultSchema["Views"])
//     ? (DefaultSchema["Tables"] &
//         DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
//         Row: infer R
//       }
//       ? R
//       : never
//     : never

// export type TablesInsert<
//   DefaultSchemaTableNameOrOptions extends
//     | keyof DefaultSchema["Tables"]
//     | { schema: keyof DatabaseWithoutInternals },
//   TableName extends DefaultSchemaTableNameOrOptions extends {
//     schema: keyof DatabaseWithoutInternals
//   }
//     ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
//     : never = never,
// > = DefaultSchemaTableNameOrOptions extends {
//   schema: keyof DatabaseWithoutInternals
// }
//   ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
//       Insert: infer I
//     }
//     ? I
//     : never
//   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
//     ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
//         Insert: infer I
//       }
//       ? I
//       : never
//     : never

// export type TablesUpdate<
//   DefaultSchemaTableNameOrOptions extends
//     | keyof DefaultSchema["Tables"]
//     | { schema: keyof DatabaseWithoutInternals },
//   TableName extends DefaultSchemaTableNameOrOptions extends {
//     schema: keyof DatabaseWithoutInternals
//   }
//     ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
//     : never = never,
// > = DefaultSchemaTableNameOrOptions extends {
//   schema: keyof DatabaseWithoutInternals
// }
//   ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
//       Update: infer U
//     }
//     ? U
//     : never
//   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
//     ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
//         Update: infer U
//       }
//       ? U
//       : never
//     : never

// export type Enums<
//   DefaultSchemaEnumNameOrOptions extends
//     | keyof DefaultSchema["Enums"]
//     | { schema: keyof DatabaseWithoutInternals },
//   EnumName extends DefaultSchemaEnumNameOrOptions extends {
//     schema: keyof DatabaseWithoutInternals
//   }
//     ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
//     : never = never,
// > = DefaultSchemaEnumNameOrOptions extends {
//   schema: keyof DatabaseWithoutInternals
// }
//   ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
//   : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
//     ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
//     : never

// export type CompositeTypes<
//   PublicCompositeTypeNameOrOptions extends
//     | keyof DefaultSchema["CompositeTypes"]
//     | { schema: keyof DatabaseWithoutInternals },
//   CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
//     schema: keyof DatabaseWithoutInternals
//   }
//     ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
//     : never = never,
// > = PublicCompositeTypeNameOrOptions extends {
//   schema: keyof DatabaseWithoutInternals
// }
//   ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
//   : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
//     ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
//     : never

// export const Constants = {
//   public: {
//     Enums: {
//       app_role: ["owner", "trainer", "member"],
//       attendance_method: ["qr", "manual"],
//       membership_type: ["free", "paid", "personal"],
//       payment_method: ["gpay", "phonepe", "cash"],
//       payment_status: ["pending", "completed", "failed"],
//     },
//   },
// } as const


export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          check_in_time: string
          gym_id: string
          id: string
          member_id: string
          method: Database["public"]["Enums"]["attendance_method"]
        }
        Insert: {
          check_in_time?: string
          gym_id: string
          id?: string
          member_id: string
          method?: Database["public"]["Enums"]["attendance_method"]
        }
        Update: {
          check_in_time?: string
          gym_id?: string
          id?: string
          member_id?: string
          method?: Database["public"]["Enums"]["attendance_method"]
        }
        Relationships: [
          {
            foreignKeyName: "attendance_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "gym_members"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_plans: {
        Row: {
          created_at: string
          created_by: string | null
          gym_id: string
          id: string
          is_free: boolean
          member_id: string | null
          plan_data: Json
          updated_at: string
          week_start_date: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          gym_id: string
          id?: string
          is_free?: boolean
          member_id?: string | null
          plan_data?: Json
          updated_at?: string
          week_start_date: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          gym_id?: string
          id?: string
          is_free?: boolean
          member_id?: string | null
          plan_data?: Json
          updated_at?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "diet_plans_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_plans_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "gym_members"
            referencedColumns: ["id"]
          },
        ]
      }
      gym_members: {
        Row: {
          assigned_trainer_id: string | null
          avatar_url: string | null
          created_at: string
          end_date: string | null
          gym_id: string
          id: string
          membership_plan_id: string | null
          membership_type: Database["public"]["Enums"]["membership_type"]
          payment_received: boolean | null
          registration_id: string | null
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_trainer_id?: string | null
          avatar_url?: string | null
          created_at?: string
          end_date?: string | null
          gym_id: string
          id?: string
          membership_plan_id?: string | null
          membership_type?: Database["public"]["Enums"]["membership_type"]
          payment_received?: boolean | null
          registration_id?: string | null
          start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_trainer_id?: string | null
          avatar_url?: string | null
          created_at?: string
          end_date?: string | null
          gym_id?: string
          id?: string
          membership_plan_id?: string | null
          membership_type?: Database["public"]["Enums"]["membership_type"]
          payment_received?: boolean | null
          registration_id?: string | null
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gym_members_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gym_members_membership_plan_id_fkey"
            columns: ["membership_plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      gym_trainers: {
        Row: {
          created_at: string
          gym_id: string
          id: string
          specialization: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          gym_id: string
          id?: string
          specialization?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          gym_id?: string
          id?: string
          specialization?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gym_trainers_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      gyms: {
        Row: {
          address: string
          city: string
          contact_number: string
          created_at: string
          facilities: string[] | null
          gpay_qr: string | null
          gym_images: string[] | null
          id: string
          is_active: boolean
          name: string
          owner_id: string
          phonepe_qr: string | null
          pincode: string | null
          services: string[] | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          contact_number: string
          created_at?: string
          facilities?: string[] | null
          gpay_qr?: string | null
          gym_images?: string[] | null
          id?: string
          is_active?: boolean
          name: string
          owner_id: string
          phonepe_qr?: string | null
          pincode?: string | null
          services?: string[] | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          contact_number?: string
          created_at?: string
          facilities?: string[] | null
          gpay_qr?: string | null
          gym_images?: string[] | null
          id?: string
          is_active?: boolean
          name?: string
          owner_id?: string
          phonepe_qr?: string | null
          pincode?: string | null
          services?: string[] | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      membership_plans: {
        Row: {
          created_at: string
          description: string | null
          duration_months: number
          gym_id: string
          id: string
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_months?: number
          gym_id: string
          id?: string
          is_active?: boolean
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_months?: number
          gym_id?: string
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_plans_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          gym_id: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          gym_id: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          gym_id?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          gym_id: string
          id: string
          member_id: string
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          status: Database["public"]["Enums"]["payment_status"]
        }
        Insert: {
          amount: number
          created_at?: string
          gym_id: string
          id?: string
          member_id: string
          payment_date?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Update: {
          amount?: number
          created_at?: string
          gym_id?: string
          id?: string
          member_id?: string
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payments_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "gym_members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string
          gender: string | null
          goals: string[] | null
          id: string
          mobile_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city: string
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name: string
          gender?: string | null
          goals?: string[] | null
          id?: string
          mobile_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string
          gender?: string | null
          goals?: string[] | null
          id?: string
          mobile_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          created_at: string
          created_by: string | null
          gym_id: string
          id: string
          member_id: string
          plan_data: Json
          updated_at: string
          week_start_date: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          gym_id: string
          id?: string
          member_id: string
          plan_data?: Json
          updated_at?: string
          week_start_date: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          gym_id?: string
          id?: string
          member_id?: string
          plan_data?: Json
          updated_at?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_plans_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "gym_members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "trainer" | "member"
      attendance_method: "qr" | "manual"
      membership_type: "free" | "paid" | "personal"
      payment_method: "gpay" | "phonepe" | "cash"
      payment_status: "pending" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "trainer", "member"],
      attendance_method: ["qr", "manual"],
      membership_type: ["free", "paid", "personal"],
      payment_method: ["gpay", "phonepe", "cash"],
      payment_status: ["pending", "completed", "failed"],
    },
  },
} as const
