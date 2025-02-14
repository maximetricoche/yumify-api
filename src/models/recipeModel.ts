import type { ConnectionDB, Result, Rows } from "../configs/database";
import { IngredientDTO, RecipeDTO, RecipeSummaryDTO, StepDTO } from "../types/recipe.dto";

import db from "../configs/database";

const readAll = async (userId: number): Promise<RecipeSummaryDTO[]> => {
  const [rows] = await db.query<Rows>(
    `
        SELECT
          recipes.id,
          title, 
          prep_time AS prepTime, 
          cook_time AS cookTime,
          category,
          images.file_path AS image
        FROM recipes
        LEFT JOIN images
          ON recipes.image_id = images.id
        WHERE user_id = ?
        `,
    [userId],
  );

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    prepTime: row.prepTime,
    cookTime: row.cookTime,
    category: row.category,
    image: row.image,
  }));
};

const read = async (recipeId: number, userId: number): Promise<RecipeDTO> => {
  const [rows] = await db.query<Rows>(
    `
      SELECT
        recipes.id,
        title,
        prep_time AS prepTime,
        cook_time AS cookTime,
        category,
        images.file_path AS image
      FROM recipes
      LEFT JOIN images    
        ON recipes.image_id = images.id
      WHERE recipes.id = ? AND recipes.user_id = ?
      `,
    [recipeId, userId],
  );

  const recipe: RecipeDTO = {
    id: rows[0].id,
    title: rows[0].title,
    prepTime: rows[0].prepTime,
    cookTime: rows[0].cookTime,
    category: rows[0].category,
    image: rows[0].image,
    ingredients: [],
    steps: [],
  };

  const [ingredients] = await db.query<Rows>(
    `
      SELECT 
        ing.name,
        ing.id,
        ri.quantity,
        ri.unit
      FROM recipe_ingredients ri
      JOIN ingredients ing
        ON ri.ingredient_id = ing.id
      WHERE ri.recipe_id = ?
      `,
    [recipeId],
  );

  recipe.ingredients = ingredients.map((ingredient) => ({
    id: ingredient.id,
    name: ingredient.name,
    quantity: ingredient.quantity,
    unit: ingredient.unit,
  }));

  const [steps] = await db.query<Rows>(
    `
      SELECT
        step_number AS stepNumber,
        description
      FROM steps
      WHERE recipe_id = ?
      `,
    [recipeId],
  );

  recipe.steps = steps.map((step) => ({
    stepNumber: step.stepNumber,
    description: step.description,
  }));

  return recipe;
};

const updateRecipe = async (connection: ConnectionDB, recipeId: number, updatedData: RecipeDTO): Promise<Result> => {
  const { title, prepTime, cookTime, category } = updatedData;

  const [result] = await connection.execute<Result>(
    `
    UPDATE recipes
    SET title = ?, prep_time = ?, cook_time = ?, category = ?
    WHERE id = ?
    `,
    [title, prepTime, cookTime, category, recipeId],
  );

  return result;
};

const updateIngredients = async (connection: ConnectionDB, recipeId: number, updatedIngredients: IngredientDTO[]): Promise<{ affectedRows: number }> => {
  const updateResults = await Promise.all(
    updatedIngredients.map(({ id, name, quantity, unit }) =>
      Promise.all([
        connection.execute<Result>(
          `
        UPDATE ingredients
        SET name = ?
        WHERE id = ?
        `,
          [name, id],
        ),
        connection.execute<Result>(
          `
        UPDATE recipe_ingredients
        SET quantity = ?, unit = ?
        WHERE recipe_id = ? AND ingredient_id = ?
        `,
          [quantity, unit, recipeId, id],
        ),
      ]),
    ),
  );

  let affectedRows = 0;
  updateResults.forEach(([ingredientUpdateResult, recipeIngredientUpdateResult]) => {
    affectedRows += ingredientUpdateResult[0].affectedRows > 0 ? 1 : 0;
    affectedRows += recipeIngredientUpdateResult[0].affectedRows > 0 ? 1 : 0;
  });

  return { affectedRows };
};

const updateSteps = async (connection: ConnectionDB, recipeId: number, updatedSteps: StepDTO[]): Promise<{ affectedRows: number }> => {
  const updateResults = await Promise.all(
    updatedSteps.map(({ stepNumber, description }) =>
      connection.execute<Result>(
        `
        UPDATE steps
        SET description = ?
        WHERE recipe_id = ? AND step_number = ?
        `,
        [description, recipeId, stepNumber],
      ),
    ),
  );

  const affectedRows = updateResults.filter(([result]) => result.affectedRows > 0).length;
  return { affectedRows };
};

const createRecipe = async (connection: ConnectionDB, newRecipe: RecipeDTO) => {
  const { title, prepTime, cookTime, category, userId } = newRecipe;

  // FIXME: This should be moved to a service
  // Generate a random seed to get a random image from the Picsum API
  const randomSeed = Math.floor(Math.random() * 1000);
  const imageUrl = `https://picsum.photos/seed/${randomSeed}/500/350`;

  const [result] = await connection.execute<Result>(
    `
    INSERT INTO recipes (title, prep_time, cook_time, category, user_id, image_id)
    VALUES (?, ?, ?, ?, ?)
    `,
    [title, prepTime, cookTime, category, userId, imageUrl],
  );

  return result.insertId;
};

const addIngredients = async (connection: ConnectionDB, newRecipeId: number, ingredients: IngredientDTO[]) => {
  for (const ingredient of ingredients) {
    await connection.execute<Result>(
      `
          INSERT IGNORE INTO ingredients (name)
          VALUES (?)
          `,
      [ingredient.name],
    );

    const [rows] = await connection.execute<Rows>(
      `
          SELECT id
          FROM ingredients
          WHERE name = ? 
          `,
      [ingredient.name],
    );

    const ingredientId = rows[0].id;

    await connection.execute(
      `
            INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
            VALUES (?, ?, ?, ?)
            `,
      [newRecipeId, ingredientId, ingredient.quantity, ingredient.unit],
    );
  }
};

const addSteps = async (connection: ConnectionDB, recipeId: number, steps: StepDTO[]) => {
  await Promise.all(
    steps.map(({ stepNumber, description }) =>
      connection.execute<Result>(
        `
        INSERT INTO steps (recipe_id, step_number, description)
        VALUES (?, ?, ?)
        `,
        [recipeId, stepNumber, description],
      ),
    ),
  );
};

const deleteRecipe = async (recipeId: number) => {
  const [result] = await db.query<Result>(
    `
    DELETE FROM recipes
    WHERE id = ?
    `,
    [recipeId],
  );
  return result;
};

export default { readAll, read, updateRecipe, updateIngredients, updateSteps, createRecipe, addIngredients, addSteps, deleteRecipe };
