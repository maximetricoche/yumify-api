import mysql from "mysql2/promise";
import fs from "node:fs";
import { env } from "../configs/env";

const migrate = async () => {
  console.info("🚀 Début de la migration...");

  try {
    const sql = fs.readFileSync("src/databases/schema.sql", "utf-8");

    console.info("🔗 Connexion à la base de données...");
    const database = await mysql.createConnection({
      host: env.DB_HOST,
      port: Number.parseInt(env.DB_PORT as string),
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      multipleStatements: true,
    });

    console.info(`🗑️  Suppression de la base de données existante : ${env.DB_NAME}`);
    await database.query(`DROP DATABASE IF EXISTS ${env.DB_NAME}`);

    console.info(`➕ Création de la base de données : ${env.DB_NAME}`);
    await database.query(`CREATE DATABASE ${env.DB_NAME}`);

    console.info(`📌 Utilisation de la base de données : ${env.DB_NAME}`);
    await database.query(`USE ${env.DB_NAME}`);

    console.info("📖 Exécution des requêtes SQL...");
    await database.query(sql);

    database.end();
    console.info("✅ Migration terminée avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de la migration !", error);
    process.exit(1);
  }
};
migrate();
