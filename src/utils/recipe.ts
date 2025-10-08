export interface IRecipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

export interface IRecipeResponse {
  recipes: IRecipe[];
  total: number;
  skip: number;
  limit: number;
}

const BASE_URL = "https://dummyjson.com/recipes";

type GetAllRecipesParams = {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
};

export const getAllRecipes = async ({
  page = 1,
  limit = 21,
  search = "",
  filter = "",
}: GetAllRecipesParams = {}): Promise<IRecipe[]> => {
  const skip = (page - 1) * limit;

  try {
    const res = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
    const data: IRecipeResponse = await res.json();
    if (!data.recipes.length) return Promise.reject(new Error("No recipes is available"));
    return data.recipes;
  } catch {
    return Promise.reject(new Error("Something went wrong with recipes, try again later"));
  }
};
