import db from "./database";
import { env } from "./env";

db.getConnection()
  .then((connection) => {
    console.info(`✅ Connexion à la base de donnée ${env.DB_NAME} réussie`);

    connection.release();
  })
  .catch((error: Error) => {
    console.error("❌ Erreur :\n", ` Connexion à la base de donnée ${env.DB_NAME} échouée\n`, " Veuillez vérifier vos identifiants de connexion dans le fichier .env");
    console.warn(error.message);
  });
