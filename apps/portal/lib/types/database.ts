export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          visibility: 'private' | 'public'
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          visibility?: 'private' | 'public'
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          visibility?: 'private' | 'public'
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      project_items: {
        Row: {
          id: string
          project_id: string
          slug: string
          title: string
          content: Json
          type: 'paper' | 'document' | 'experiment' | 'dataset' | 'visualization'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          slug: string
          title: string
          content: Json
          type: 'paper' | 'document' | 'experiment' | 'dataset' | 'visualization'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          slug?: string
          title?: string
          content?: Json
          type?: 'document' | 'experiment' | 'dataset' | 'visualization'
          created_at?: string
          updated_at?: string
        }
      }
      share_tokens: {
        Row: {
          id: string
          token: string
          project_id: string
          item_id: string | null
          created_at: string
          expires_at: string | null
          access_count: number
        }
        Insert: {
          id?: string
          token: string
          project_id: string
          item_id?: string | null
          created_at?: string
          expires_at?: string | null
          access_count?: number
        }
        Update: {
          id?: string
          token?: string
          project_id?: string
          item_id?: string | null
          created_at?: string
          expires_at?: string | null
          access_count?: number
        }
      }
    }
  }
}