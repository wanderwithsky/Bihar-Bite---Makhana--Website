import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Address } from '../types';

export const AccountService = {
  async uploadProfileImage(file: File, userId: string): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      // Local fallback: use object URL or base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Supabase image upload failed, falling back to local base64:', err);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<boolean> {
    const localUser = localStorage.getItem('bihar_bite_user_session');
    if (localUser) {
      const parsed = JSON.parse(localUser);
      localStorage.setItem('bihar_bite_user_session', JSON.stringify({ ...parsed, ...updates }));
    }

    if (!isSupabaseConfigured || !supabase) return true;

    try {
      const { updateUserProfile } = await import('../lib/supabase');
      await updateUserProfile(userId, updates);
      return true;
    } catch (err) {
      console.error('Supabase profile update failed:', err);
      return false; // Still true locally, but we return false to notify UI of DB failure
    }
  }
};
