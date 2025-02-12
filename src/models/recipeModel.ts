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

  return rows;
};

export default { readAll };
