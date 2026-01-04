// backend/storeSecret.js
// backend/storeSecret.js
import fs from "fs";

const FILE = "secretStore.json";

export function storeSecretInBackend(productId, secret) {
  let data = {};

  if (fs.existsSync(FILE)) {
    data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  }

  data[productId] = secret;

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}
