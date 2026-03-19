import { Router } from "express";
import { ConversationController } from "./conversation.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get("/list", auth(), ConversationController.list);
router.post("/create", auth(), ConversationController.getOrCreate);

export const conversationRoutes = router;
