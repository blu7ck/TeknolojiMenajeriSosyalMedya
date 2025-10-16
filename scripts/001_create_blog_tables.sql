-- Blog posts table
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  content text not null,
  featured_image text,
  tags text[], -- SEO tags, not displayed
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reactions table
create table if not exists public.blog_reactions (
  id uuid primary key default gen_random_uuid(),
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('inspired', 'idea', 'motivated')),
  ip_address text not null,
  user_identifier text not null, -- cookie or IP hash
  created_at timestamptz default now(),
  unique(blog_post_id, user_identifier, reaction_type)
);

-- Newsletter subscribers table
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  profession text,
  email text unique not null,
  is_active boolean default true,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz
);

-- Create indexes for better performance
create index if not exists idx_blog_posts_status on public.blog_posts(status);
create index if not exists idx_blog_posts_published_at on public.blog_posts(published_at);
create index if not exists idx_blog_reactions_post_id on public.blog_reactions(blog_post_id);
create index if not exists idx_blog_reactions_user on public.blog_reactions(user_identifier);
create index if not exists idx_newsletter_email on public.newsletter_subscribers(email);

-- Enable Row Level Security
alter table public.blog_posts enable row level security;
alter table public.blog_reactions enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- RLS Policies for blog_posts
-- Anyone can read published posts
create policy "Anyone can view published blog posts"
  on public.blog_posts for select
  using (status = 'published');

-- Only authenticated users can insert/update/delete (for admin panel)
create policy "Authenticated users can insert blog posts"
  on public.blog_posts for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update blog posts"
  on public.blog_posts for update
  to authenticated
  using (true);

create policy "Authenticated users can delete blog posts"
  on public.blog_posts for delete
  to authenticated
  using (true);

-- RLS Policies for blog_reactions
-- Anyone can read reactions
create policy "Anyone can view reactions"
  on public.blog_reactions for select
  using (true);

-- Anyone can insert reactions (we'll handle duplicate prevention in app logic)
create policy "Anyone can add reactions"
  on public.blog_reactions for insert
  with check (true);

-- RLS Policies for newsletter_subscribers
-- Anyone can subscribe
create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscribers for insert
  with check (true);

-- Only authenticated users can view subscribers (for admin)
create policy "Authenticated users can view subscribers"
  on public.newsletter_subscribers for select
  to authenticated
  using (true);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger for blog_posts updated_at
drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
  before update on public.blog_posts
  for each row
  execute function public.handle_updated_at();
