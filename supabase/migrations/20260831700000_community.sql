-- Community: ชุมชนสำหรับแชร์เรื่องราว

CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  nest_id uuid REFERENCES public.nests(id) ON DELETE SET NULL,
  title text,
  content text NOT NULL,
  media_urls text[],
  likes_count int DEFAULT 0,
  comments_count int DEFAULT 0,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_likes (
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public posts" ON public.community_posts
  FOR SELECT USING (is_public = true OR author_id = auth.uid());

CREATE POLICY "Users can create posts" ON public.community_posts
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update own posts" ON public.community_posts
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Authors can delete own posts" ON public.community_posts
  FOR DELETE USING (author_id = auth.uid());

CREATE POLICY "Anyone can view comments" ON public.community_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON public.community_comments
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Anyone can view likes" ON public.community_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can toggle likes" ON public.community_likes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove likes" ON public.community_likes
  FOR DELETE USING (user_id = auth.uid());

-- Index
CREATE INDEX IF NOT EXISTS community_posts_author_idx ON public.community_posts(author_id);
CREATE INDEX IF NOT EXISTS community_posts_created_idx ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS community_comments_post_idx ON public.community_comments(post_id);
