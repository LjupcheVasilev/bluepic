import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = typeof supabase

export type Post = {
  id: string;
  user_id: string;
  image_url: string;
  caption?: string;
  created_at: string;
};

export async function createPost(
  userId: string,
  imageUrl: string,
  caption?: string
) {
  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        user_id: userId,
        image_url: imageUrl,
        caption,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles:user_id(username, avatar_url)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUserPosts(userId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deletePost(postId: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}

// Storage functions for images
export async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteImage(imageUrl: string) {
  const imagePath = imageUrl.split('/').pop();
  if (!imagePath) throw new Error('Invalid image URL');

  const { error } = await supabase.storage
    .from('images')
    .remove([imagePath]);

  if (error) throw error;
}
