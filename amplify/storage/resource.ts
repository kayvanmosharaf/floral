import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "contactAttachments",
  access: (allow) => ({
    "contact-attachments/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
  }),
});
