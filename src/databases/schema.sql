CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  file_path VARCHAR(255),
  file_name VARCHAR(255)
);

CREATE TABLE recipes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  prep_time INT UNSIGNED NOT NULL,
  cook_time INT UNSIGNED NOT NULL,
  category VARCHAR(100) NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  image_id INT UNSIGNED,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_image_id FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL
);

CREATE TABLE steps (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  step_number INT UNSIGNED NOT NULL,
  description TEXT NOT NULL,
  recipe_id INT UNSIGNED NOT NULL,
  CONSTRAINT fk_recipe_step FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  CONSTRAINT unique_step_number UNIQUE (step_number, recipe_id)
);

CREATE TABLE ingredients (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE recipe_ingredients (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  recipe_id INT UNSIGNED NOT NULL,
  ingredient_id INT UNSIGNED NOT NULL,
  CONSTRAINT fk_recipe_ingredient FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  CONSTRAINT fk_ingredient_id FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

INSERT INTO users (email, password) 
VALUES ("toto@toto.com", "toto");

INSERT INTO images (file_path, file_name)
VALUES 
("uploads/recette1", "recette1.jpg"),
("uploads/recette2", "recette2.jpg"),
("uploads/recette3", "recette3.jpg"),
("uploads/recette4", "recette4.jpg"),
("uploads/recette5", "recette5.jpg"),
("uploads/recette6", "recette6.jpg"),
("uploads/recette7", "recette7.jpg"),
("uploads/recette8", "recette8.jpg"),
("uploads/recette9", "recette9.jpg"),
("uploads/recette10", "recette10.jpg");

INSERT INTO recipes (title, prep_time, cook_time, category, user_id, image_id)
VALUES
("Spaghetti Carbonara", 10, 20, "Familiale", 1, 1),
("Curry de Poulet", 15, 40, "Cuisine du monde", 1, 2),
("Ragoût de Boeuf", 20, 60, "Française", 1, 3),
("Salade César", 10, 0, "Salade", 1, 4),
("Pizza Margherita", 20, 15, "Italienne", 1, 5),
("Soupe à l'oignon", 15, 30, "Française", 1, 6),
("Tacos", 20, 10, "Mexicaine", 1, 7),
("Paella", 30, 45, "Espagnole", 1, 8),
("Sushi", 40, 0, "Japonaise", 1, 9),
("Hamburger", 15, 10, "Américaine", 1, 10);

INSERT INTO steps (step_number, description, recipe_id) 
VALUES
(1, "Faire cuire les pâtes jusqu'à ce qu'elles soient al dente.", 1),
(2, "Faire frire le bacon et le mélanger avec les œufs.", 1),
(3, "Mélanger les pâtes avec le mélange d'œufs.", 1),
(4, "Ajouter du parmesan râpé.", 1),
(5, "Servir chaud.", 1),
(1, "Faire cuire le poulet avec les épices.", 2),
(2, "Ajouter le lait de coco et laisser mijoter.", 2),
(3, "Servir avec du riz.", 2),
(1, "Faire dorer le boeuf et ajouter les légumes.", 3),
(2, "Laisser mijoter pendant une heure.", 3),
(3, "Ajouter des herbes fraîches avant de servir.", 3),
(1, "Mélanger la laitue avec la sauce César.", 4),
(2, "Ajouter les croûtons et le parmesan.", 4),
(3, "Servir immédiatement.", 4),
(1, "Préparer la pâte à pizza.", 5),
(2, "Ajouter la sauce tomate et la mozzarella.", 5),
(3, "Cuire au four pendant 15 minutes.", 5),
(4, "Ajouter du basilic frais avant de servir.", 5),
(1, "Faire revenir les oignons jusqu'à ce qu'ils soient dorés.", 6),
(2, "Ajouter le bouillon et laisser mijoter.", 6),
(3, "Servir avec du pain grillé.", 6),
(1, "Préparer les tortillas.", 7),
(2, "Ajouter la viande et les garnitures.", 7),
(3, "Servir avec des sauces.", 7),
(1, "Faire cuire le riz avec le safran.", 8),
(2, "Ajouter les fruits de mer et laisser mijoter.", 8),
(3, "Servir chaud.", 8),
(1, "Préparer le riz à sushi.", 9),
(2, "Rouler les sushis avec le poisson et les légumes.", 9),
(3, "Servir avec de la sauce soja.", 9),
(1, "Faire cuire les steaks hachés.", 10),
(2, "Assembler les hamburgers avec les garnitures.", 10),
(3, "Servir avec des frites.", 10);

INSERT INTO ingredients (name) 
VALUES
("Spaghetti"),
("Bacon"),
("Œufs"),
("Poulet"),
("Lait de Coco"),
("Boeuf"),
("Carottes"),
("Oignons"),
("Ail"),
("Concentré de Tomates"),
("Laitue"),
("Croûtons"),
("Parmesan"),
("Pâte à Pizza"),
("Sauce Tomate"),
("Mozzarella"),
("Bouillon"),
("Tortillas"),
("Riz"),
("Safran"),
("Fruits de Mer"),
("Poisson"),
("Steak Haché"),
("Pain à Hamburger");

INSERT INTO recipe_ingredients (quantity, unit, recipe_id, ingredient_id) 
VALUES
(200, "gr", 1, 1),
(100, "gr", 1, 2),
(2, "pièces", 1, 3),
(300, "gr", 2, 4),
(200, "ml", 2, 5),
(500, "gr", 3, 6),
(100, "gr", 3, 7),
(50, "gr", 3, 8),
(2, "gousses", 3, 9),
(100, "gr", 3, 10),
(1, "pièce", 4, 11),
(50, "gr", 4, 12),
(30, "gr", 4, 13),
(1, "pièce", 5, 14),
(100, "gr", 5, 15),
(100, "gr", 5, 16),
(500, "ml", 6, 17),
(4, "pièces", 7, 18),
(200, "gr", 8, 19),
(1, "gr", 8, 20),
(300, "gr", 8, 21),
(200, "gr", 9, 22),
(2, "pièces", 10, 23),
(2, "pièces", 10, 24);