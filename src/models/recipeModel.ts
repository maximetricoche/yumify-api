import db from "../configs/database";
import type { Rows } from "../configs/database";

const readAll = async (userId: number) => {
  const [rows] = await db.query<Rows>(
    `
      SELECT
        recipes.id,
        title, 
        prep_time, 
        cook_time,
        category,
        images.file_path
      FROM recipes
      LEFT JOIN images
        ON recipes.image_id = images.id
      WHERE user_id = ?
      `,
    [userId],
  );

  const recipes = {
    id: rows[0].id,
    title: rows[0].title,
    prepTime: rows[0].prep_time,
    cookTime: rows[0].cook_time,
    category: rows[0].category,
    image: rows[0].file_path,
  };

  return [recipes];
};

const read = async (recipeId: number, userId: number) => {
  const [recipeData] = await db.query<Rows>(
    `
    SELECT
      recipes.id,
      title,
      prep_time,
      cook_time,
      category,
      images.file_path
    FROM recipes
    LEFT JOIN images    
      ON recipes.image_id = images.id
    WHERE recipes.id = ? AND recipes.user_id = ?
    `,
    [recipeId, userId],
  );
  const recipe = {
    id: recipeData[0].id,
    title: recipeData[0].title,
    prepTime: recipeData[0].prep_time,
    cookTime: recipeData[0].cook_time,
    category: recipeData[0].category,
    image: recipeData[0].file_path,
    ingredients: [] as { name: string; quantity: number; unit: string }[],
    steps: [] as { stepNumber: number; description: string }[],
  };

  const [ingredientsData] = await db.query<Rows>(
    `
    SELECT
      ing.name,
      ri.quantity,
      ri.unit
    FROM recipe_ingredients ri
    JOIN ingredients ing
      ON ri.ingredient_id = ing.id
    WHERE ri.recipe_id = ?
    `,
    [recipeId],
  );

  ingredientsData.forEach((ingredient) => {
    recipe.ingredients.push({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    });
  });

  const [stepsData] = await db.query<Rows>(
    `
    SELECT
      step_number,
      description
    FROM steps
    WHERE recipe_id = ?
    `,
    [recipeId],
  );

  stepsData.forEach((step) => {
    recipe.steps.push({
      stepNumber: step.step_number,
      description: step.description,
    });
  });

  return [recipe];
};

export default { readAll, read };
