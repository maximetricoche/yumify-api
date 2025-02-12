import app from "./app";
import { env } from "./configs/env";

import "./configs/checkConnection";

const PORT = env.APP_PORT;

app.listen(PORT, () => {
  console.log(`✅ Le serveur est lancé sur le port ${PORT}`);
});
