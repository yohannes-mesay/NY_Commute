export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      cccboxcarfares: {
        Row: {
          boxcar_route: string
          boxcar_station: string | null
          id: string
          member_afternoon_price: number | null
          member_morning_price: number | null
          member_roundtrip_price: number | null
          monthly_membership: number | null
          std_afternoon_price: number | null
          std_morning_price: number | null
          std_roundtrip_price: number | null
        }
        Insert: {
          boxcar_route: string
          boxcar_station?: string | null
          id?: string
          member_afternoon_price?: number | null
          member_morning_price?: number | null
          member_roundtrip_price?: number | null
          monthly_membership?: number | null
          std_afternoon_price?: number | null
          std_morning_price?: number | null
          std_roundtrip_price?: number | null
        }
        Update: {
          boxcar_route?: string
          boxcar_station?: string | null
          id?: string
          member_afternoon_price?: number | null
          member_morning_price?: number | null
          member_roundtrip_price?: number | null
          monthly_membership?: number | null
          std_afternoon_price?: number | null
          std_morning_price?: number | null
          std_roundtrip_price?: number | null
        }
        Relationships: []
      }
      ccccommuteforminputs: {
        Row: {
          commute_days_per_week: number | null
          commute_method: string | null
          commute_origin: string | null
          created_at: string
          departure_time: string | null
          id: string
          office_address: string | null
          ranking_comfort: number | null
          ranking_cost: number | null
          ranking_on_time: number | null
          ranking_relaxation: number | null
        }
        Insert: {
          commute_days_per_week?: number | null
          commute_method?: string | null
          commute_origin?: string | null
          created_at: string
          departure_time?: string | null
          id?: string
          office_address?: string | null
          ranking_comfort?: number | null
          ranking_cost?: number | null
          ranking_on_time?: number | null
          ranking_relaxation?: number | null
        }
        Update: {
          commute_days_per_week?: number | null
          commute_method?: string | null
          commute_origin?: string | null
          created_at?: string
          departure_time?: string | null
          id?: string
          office_address?: string | null
          ranking_comfort?: number | null
          ranking_cost?: number | null
          ranking_on_time?: number | null
          ranking_relaxation?: number | null
        }
        Relationships: []
      }
      cccdrivingcostreference: {
        Row: {
          congestion_fee: number | null
          distance_roundtrip: number | null
          effective_date: string | null
          gas_price_per_gall: number | null
          id: string
          mpg: number | null
          parking: number | null
          tolls: number
        }
        Insert: {
          congestion_fee?: number | null
          distance_roundtrip?: number | null
          effective_date?: string | null
          gas_price_per_gall?: number | null
          id?: string
          mpg?: number | null
          parking?: number | null
          tolls: number
        }
        Update: {
          congestion_fee?: number | null
          distance_roundtrip?: number | null
          effective_date?: string | null
          gas_price_per_gall?: number | null
          id?: string
          mpg?: number | null
          parking?: number | null
          tolls?: number
        }
        Relationships: []
      }
      cccnjtrafares: {
        Row: {
          daily_one_way: number | null
          daily_round_trip: number | null
          distance_miles: number | null
          id: string
          line: string | null
          monthly: number | null
          train_station: string | null
          weekly: number | null
        }
        Insert: {
          daily_one_way?: number | null
          daily_round_trip?: number | null
          distance_miles?: number | null
          id?: string
          line?: string | null
          monthly?: number | null
          train_station?: string | null
          weekly?: number | null
        }
        Update: {
          daily_one_way?: number | null
          daily_round_trip?: number | null
          distance_miles?: number | null
          id?: string
          line?: string | null
          monthly?: number | null
          train_station?: string | null
          weekly?: number | null
        }
        Relationships: []
      }
      commutingdata: {
        Row: {
          congestion_pricing: boolean | null
          date: string | null
          duration_minutes: number | null
          id: string
          is_commuting_day: boolean | null
          is_morning: boolean | null
          rounded_time: string | null
          route_id: string | null
          route_name: string | null
          time: string | null
          timestamp_collected: string
          weekday: string | null
        }
        Insert: {
          congestion_pricing?: boolean | null
          date?: string | null
          duration_minutes?: number | null
          id?: string
          is_commuting_day?: boolean | null
          is_morning?: boolean | null
          rounded_time?: string | null
          route_id?: string | null
          route_name?: string | null
          time?: string | null
          timestamp_collected: string
          weekday?: string | null
        }
        Update: {
          congestion_pricing?: boolean | null
          date?: string | null
          duration_minutes?: number | null
          id?: string
          is_commuting_day?: boolean | null
          is_morning?: boolean | null
          rounded_time?: string | null
          route_id?: string | null
          route_name?: string | null
          time?: string | null
          timestamp_collected?: string
          weekday?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "CommutingData_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "RouteIDs"
            referencedColumns: ["route_id"]
          },
        ]
      }
      routeids: {
        Row: {
          alt_route_name: string | null
          finish_address: string | null
          finish_point: string | null
          route_id: string
          starting_address: string | null
          starting_point: string
        }
        Insert: {
          alt_route_name?: string | null
          finish_address?: string | null
          finish_point?: string | null
          route_id?: string
          starting_address?: string | null
          starting_point: string
        }
        Update: {
          alt_route_name?: string | null
          finish_address?: string | null
          finish_point?: string | null
          route_id?: string
          starting_address?: string | null
          starting_point?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
