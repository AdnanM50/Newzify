import { Router } from "express";
import auth from "../../middleware/auth";
import validate from "../../middleware/validate";
import { CommentValidation } from "./comment.validation";
import { CommentController } from "./comment.controller";

const router = Router();

// Create a comment or reply
router.post(
    "/create",
    auth(),
    validate(CommentValidation.createCommentSchema),
    CommentController.createComment
);

// Get comments for a news
router.get("/news/:newsId", CommentController.getCommentsByNewsId);

// Toggle like on a comment
router.patch("/like/:id", auth(), CommentController.toggleLike);

// Delete a comment
router.delete("/:id", auth(), CommentController.deleteComment);

export const commentRoutes = router;
