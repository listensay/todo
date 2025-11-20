export interface TypeTodoItemProps {
  id: number;
  name: string;
  status: TypeEnumStatus;
  difficulty: keyof TypeDifficulty;
  description: string;
  updated_at?: string;
  created_at?: string;
}

// Alias for backward compatibility
export type TodoItemProps = TypeTodoItemProps;

enum TypeEnumStatus {
  Incomplete = "Incomplete",
  Complete = "Complete",
  Pending = "Pending",
}

export interface TypeDifficulty {
  Easy: string;
  Normal: string;
  Hard: string;
  Ipossible: string;
}