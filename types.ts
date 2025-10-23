export interface ProjectLink {
  live?: string;
  github?: string;
  docs?: string;
  whitepaper?: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  role: string;
  techStack: string[];
  description: string;
  longDescription: string;
  features: string[];
  screenshots?: string[];
  demoGif?: string;
  architectureDiagram?: string;
  links: ProjectLink;
  icon: string;
  isFirestore?: boolean;
}

export interface ThemeColors {
  bg1: string;
  bg2: string;
  accent: string;
  windowBg: string;
  windowHeader: string;
  textPrimary: string;
  textSecondary: string;
}

export interface AppTheme {
  light: ThemeColors;
  dark: ThemeColors;
}
