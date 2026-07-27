export type ResourceType = "pdf" | "articles" | "extras" | "announcements";

export type ContactStatus = "new" | "replied" | "archived";

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  date: string;
  url?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  published: boolean;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: string;
  goal: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}
