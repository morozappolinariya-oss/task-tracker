export type CategoryType = "work" | "home" | "personal";
export type FilterType = "all" | CategoryType | "completed";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  deadline?: string;
  category: CategoryType;
}
