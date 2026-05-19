export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          password: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          password: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password?: string;
          role?: string;
          created_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          website: string | null;
          industry: string | null;
          size: string | null;
          revenue: number | null;
          description: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          website?: string | null;
          industry?: string | null;
          size?: string | null;
          revenue?: number | null;
          description?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          website?: string | null;
          industry?: string | null;
          size?: string | null;
          revenue?: number | null;
          description?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          title: string | null;
          company: string | null;
          status: string;
          lead_score: number;
          tags: string | null;
          address: string | null;
          company_id: string | null;
          owner_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone?: string | null;
          title?: string | null;
          company?: string | null;
          status?: string;
          lead_score?: number;
          tags?: string | null;
          address?: string | null;
          company_id?: string | null;
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          phone?: string | null;
          title?: string | null;
          company?: string | null;
          status?: string;
          lead_score?: number;
          tags?: string | null;
          address?: string | null;
          company_id?: string | null;
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      deals: {
        Row: {
          id: string;
          title: string;
          value: number;
          stage: string;
          probability: number;
          close_date: string | null;
          contact_id: string | null;
          company_id: string | null;
          owner_id: string | null;
          pipeline: string;
          health_score: number;
          last_activity_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          value?: number;
          stage?: string;
          probability?: number;
          close_date?: string | null;
          contact_id?: string | null;
          company_id?: string | null;
          owner_id?: string | null;
          pipeline?: string;
          health_score?: number;
          last_activity_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          value?: number;
          stage?: string;
          probability?: number;
          close_date?: string | null;
          contact_id?: string | null;
          company_id?: string | null;
          owner_id?: string | null;
          pipeline?: string;
          health_score?: number;
          last_activity_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          due_date: string | null;
          priority: string;
          status: string;
          assignee_id: string | null;
          contact_id: string | null;
          deal_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          priority?: string;
          status?: string;
          assignee_id?: string | null;
          contact_id?: string | null;
          deal_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          due_date?: string | null;
          priority?: string;
          status?: string;
          assignee_id?: string | null;
          contact_id?: string | null;
          deal_id?: string | null;
          created_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          type: string;
          title: string;
          description: string | null;
          user_id: string | null;
          contact_id: string | null;
          deal_id: string | null;
          company_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          title: string;
          description?: string | null;
          user_id?: string | null;
          contact_id?: string | null;
          deal_id?: string | null;
          company_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          title?: string;
          description?: string | null;
          user_id?: string | null;
          contact_id?: string | null;
          deal_id?: string | null;
          company_id?: string | null;
          created_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          content: string;
          user_id: string | null;
          contact_id: string | null;
          deal_id: string | null;
          company_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          user_id?: string | null;
          contact_id?: string | null;
          deal_id?: string | null;
          company_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          user_id?: string | null;
          contact_id?: string | null;
          deal_id?: string | null;
          company_id?: string | null;
          created_at?: string;
        };
      };
      email_templates: {
        Row: {
          id: string;
          name: string;
          subject: string;
          body: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          subject: string;
          body: string;
          category?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subject?: string;
          body?: string;
          category?: string;
          created_at?: string;
        };
      };
      pipelines: {
        Row: {
          id: string;
          name: string;
          stages: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          stages: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          stages?: string;
          is_default?: boolean;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
