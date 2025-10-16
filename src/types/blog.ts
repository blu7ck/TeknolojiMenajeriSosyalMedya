export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image?: string
  author_name?: string
  author_avatar?: string
  category?: string
  tags?: string[]
  status: "draft" | "published"
  published_at?: string
  created_at: string
  updated_at: string
}

export interface BlogReaction {
  id: string
  blog_post_id: string
  reaction_type: "inspired" | "idea" | "motivated"
  ip_address: string
  user_identifier: string
  created_at: string
}

export interface NewsletterSubscriber {
  id: string
  first_name: string
  last_name: string
  profession?: string
  email: string
  is_active: boolean
  subscribed_at: string
  unsubscribed_at?: string
}

export interface ReactionCount {
  inspired: number
  idea: number
  motivated: number
}

export interface BlogPostView {
  id: string
  blog_post_id: string
  ip_address: string
  user_identifier: string
  created_at: string
}
