import db from "../configs/database";
import type { Rows, Result } from "../configs/database";

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
    ingredients: [] as { id: number; name: string; quantity: number; unit: string }[],
    steps: [] as { stepNumber: number; description: string }[],
  };

  const [ingredientsData] = await db.query<Rows>(
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

  ingredientsData.forEach((ingredient) => {
    recipe.ingredients.push({
      id: ingredient.id,
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

const updateRecipe = async (recipeId: number, updatedData: { title: string; prepTime: number; cookTime: number; category: string }) => {
  const { title, prepTime, cookTime, category } = updatedData;

  const [result] = await db.query<Result>(
    `
    UPDATE recipes
    SET title = ?, prep_time = ?, cook_time = ?, category = ?
    WHERE id = ?
    `,
    [title, prepTime, cookTime, category, recipeId],
  );

  return result.affectedRows;
};

const updateIngredients = async (recipeId: number, updatedIngredients: { id: number; name: string; quantity: number; unit: string }[]) => {
  let affectedRows = 0;

  for (const ingredient of updatedIngredients) {
    const { id, name, quantity, unit } = ingredient;

    const [ingredientUpdateResult] = await db.query<Result>(
      `
      UPDATE ingredients
      SET name = ?
      WHERE id = ?
      `,
      [name, id],
    );

    if (ingredientUpdateResult.affectedRows > 0) {
      affectedRows += ingredientUpdateResult.affectedRows;
    }

    const [result] = await db.query<Result>(
      `
        UPDATE recipe_ingredients
        SET quantity = ?, unit = ?
        WHERE recipe_id = ? AND ingredient_id = ?
        `,
      [quantity, unit, recipeId, id],
    );

    if (result.affectedRows > 0) {
      affectedRows += result.affectedRows;
    } else {
      console.log(`No update for ingredient ${id} `);
    }
  }
  return affectedRows;
};

const updateSteps = async (recipeId: number, updatedSteps: { stepNumber: number; description: string }[]) => {
  for (const step of updatedSteps) {
    const { stepNumber, description } = step;

    const [result] = await db.query<Result>(
      `
      UPDATE steps
      SET description = ?
      WHERE recipe_id = ? AND step_number = ?
      `,
      [description, recipeId, stepNumber],
    );

    return result.affectedRows;
  }
};

const createRecipe = async (newRecipe: { title: string; prepTime: number; cookTime: number; category: string; userId: number }) => {
  const { title, prepTime, cookTime, category, userId } = newRecipe;

  const [result] = await db.query<Result>(
    `
    INSERT INTO recipes (title, prep_time, cook_time, category, user_id)
    VALUES (?, ?, ?, ?, ?)
    `,
    [title, prepTime, cookTime, category, userId],
  );

  return result.insertId;
};

const insertIngrendientIfNoExists = async (ingredientName: string) => {
  const [rows] = await db.query<Rows>(
    `
    SELECT id
    FROM ingredients
    WHERE name = ?
    `,
    [ingredientName],
  );

  if (rows.length === 0) {
    await db.query<Result>(
      `
      INSERT INTO ingredients (name)
      VALUES (?)
      `,
      [ingredientName],
    );
  }
};

const getIngredientByName = async (ingredientName: string) => {
  const [rows] = await db.query<Rows>(
    `
    SELECT id
    FROM ingredients
    WHERE name = ?
    `,
    [ingredientName],
  );

  return rows[0].id;
};

const addIngredientToRecipe = async (recipeId: number, ingredientId: number, quantity: number, unit: string) => {
  await db.query<Result>(
    `
    INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
    VALUES (?, ?, ?, ?)
    `,
    [recipeId, ingredientId, quantity, unit],
  );
};

const addStepToRecipe = async (recipeId: number, stepNumber: number, description: string) => {
  await db.query<Result>(
    `
    INSERT INTO steps (recipe_id, step_number, description)
    VALUES (?, ?, ?)
    `,
    [recipeId, stepNumber, description],
  );
};

export default { readAll, read, updateRecipe, updateIngredients, updateSteps, createRecipe, insertIngrendientIfNoExists, getIngredientByName, addIngredientToRecipe, addStepToRecipe };
