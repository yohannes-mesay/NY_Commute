export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  published: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  author: string;
  published: boolean;
  tags: string[];
}
