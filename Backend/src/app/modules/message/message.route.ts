import { Router } from "express";
import { MessageController } from "./message.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/send", auth(), MessageController.send);
router.get("/list/:conversationId", auth(), MessageController.list);
router.patch("/mark-read/:conversationId", auth(), MessageController.markRead);
router.get("/unread-count", auth(), MessageController.unreadCount);

export const messageRoutes = router;
