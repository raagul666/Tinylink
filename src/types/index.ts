export interface Link {
  id: string;
  code: string;
  url: string;
  clicks: number;
  isActive: boolean;
  createdAt: string;
  lastClickedAt: string | null;
}