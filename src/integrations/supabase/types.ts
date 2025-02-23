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
      conversation_context: {
        Row: {
          context_type: string
          context_value: Json
          conversation_id: number | null
          created_at: string
          id: number
        }
        Insert: {
          context_type: string
          context_value: Json
          conversation_id?: number | null
          created_at?: string
          id?: never
        }
        Update: {
          context_type?: string
          context_value?: Json
          conversation_id?: number | null
          created_at?: string
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "conversation_context_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          age_verified: boolean | null
          celebration_details: Json | null
          created_at: string
          id: number
          location: string | null
          name: string | null
          voice_enabled: boolean | null
          wishlist: Json | null
        }
        Insert: {
          age_verified?: boolean | null
          celebration_details?: Json | null
          created_at?: string
          id?: never
          location?: string | null
          name?: string | null
          voice_enabled?: boolean | null
          wishlist?: Json | null
        }
        Update: {
          age_verified?: boolean | null
          celebration_details?: Json | null
          created_at?: string
          id?: never
          location?: string | null
          name?: string | null
          voice_enabled?: boolean | null
          wishlist?: Json | null
        }
        Relationships: []
      }
      elevenlabs_credentials: {
        Row: {
          agent_id: string
          api_key: string
          created_at: string
          id: number
        }
        Insert: {
          agent_id: string
          api_key: string
          created_at?: string
          id?: never
        }
        Update: {
          agent_id?: string
          api_key?: string
          created_at?: string
          id?: never
        }
        Relationships: []
      }
      posthog_events: {
        Row: {
          api_key: string
          created_at: string
          event: string
          id: number
          properties: Json
          timestamp: string | null
        }
        Insert: {
          api_key: string
          created_at?: string
          event: string
          id?: never
          properties: Json
          timestamp?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string
          event?: string
          id?: never
          properties?: Json
          timestamp?: string | null
        }
        Relationships: []
      }
      voice_interactions: {
        Row: {
          audio_metadata: Json | null
          conversation_id: number | null
          created_at: string
          id: number
          interaction_type: string
          response_text: string | null
          transcription: string | null
        }
        Insert: {
          audio_metadata?: Json | null
          conversation_id?: number | null
          created_at?: string
          id?: never
          interaction_type: string
          response_text?: string | null
          transcription?: string | null
        }
        Update: {
          audio_metadata?: Json | null
          conversation_id?: number | null
          created_at?: string
          id?: never
          interaction_type?: string
          response_text?: string | null
          transcription?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_interactions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      captureposthogevent: {
        Args: {
          api_key: string
          event: string
          properties: Json
        }
        Returns: undefined
      }
      triggeradditemtowishlist:
        | {
            Args: {
              itemkey: string
              itemname: string
            }
            Returns: undefined
          }
        | {
            Args: {
              itemkey: string
              itemname: string
              priority?: number
            }
            Returns: undefined
          }
      triggername: {
        Args: {
          name: string
        }
        Returns: undefined
      }
      triggerremoveitemfromwishlist: {
        Args: {
          itemkey: string
        }
        Returns: undefined
      }
      updatecelebrationdetails: {
        Args: {
          details: Json
        }
        Returns: undefined
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
