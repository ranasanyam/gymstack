import { supabase } from "../integrations/supabase/client";

export type AppRole = 'owner' | 'trainer' | 'member';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  mobile_number: string;
  email: string | null;
  gender: string | null;
  date_of_birth: string | null;
  city: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export async function signUp(
  email: string,
  password: string,
  metadata: {
    full_name: string;
    mobile_number: string;
    city: string;
    gender?: string;
    date_of_birth?: string;
  }
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
      data: metadata,
    },
  });
  return { data, error };
}
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

export async function getUserRole(userId: string): Promise<AppRole | null> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching role:', error);
    return null;
  }
  return data?.role as AppRole || null;
}

export async function setUserRole(userId: string, role: AppRole) {
  const { data, error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role })
    .select()
    .single();
  
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export function getRoleDashboardPath(role: AppRole | null): string {
  switch (role) {
    case 'owner':
      return '/owner/dashboard';
    case 'trainer':
      return '/trainer/dashboard';
    case 'member':
      return '/member/dashboard';
    default:
      return '/auth/select-role';
  }
}