export type AcademicYear = "First Year" | "Second Year" | "Third Year" | "Fourth Year";

export type Project = {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  tech_stack: string[];
  project_url: string | null;
  academic_year: AcademicYear;
  image_url: string | null;
  gallery_urls: string[] | null;
  contributors_urls: string[] | null;
  team_photo_url: string | null;
  team_photo_urls: string[] | null;
  team_photo_names: string | null;
  contributors_data: { name: string; image_url: string }[] | null;
  created_at: string;
  updated_at: string;
};

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  date_range: string;
  is_current?: boolean;
  bullet_points: string[];
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  url?: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export type ContactSettings = {
  id: string;
  linkedin_url: string | null;
  github_url: string | null;
  facebook_url: string | null;
  resume_url: string | null;
  updated_at: string;
};

export type SiteConfig = {
  id: string;
  display_name: string | null;
  title: string | null;
  hero_kicker: string | null;
  avatar_url: string | null;
  hover_avatar_url: string | null;
  about_me: string | null;
  updated_at: string;
};

export type PortfolioData = {
  config: SiteConfig | null;
  projects: Project[];
  experiences: Experience[];
  achievements: Achievement[];
  contacts: ContactSettings | null;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Visitor = {
  id: string;
  ip_address: string;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  user_agent: string | null;
  visited_at: string;
};
