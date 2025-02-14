export interface RecipeDTO {
  id?: number;
  title: string;
  prepTime: number;
  cookTime: number;
  category: string;
  image?: string;
  ingredients: IngredientDTO[];
  steps: StepDTO[];
  userId?: number;
}

export interface RecipeSummaryDTO {
  id: number;
  title: string;
  prepTime: number;
  cookTime: number;
  category: string;
  image?: string;
}

export interface IngredientDTO {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface StepDTO {
  id?: number;
  stepNumber: number;
  description: string;
}
