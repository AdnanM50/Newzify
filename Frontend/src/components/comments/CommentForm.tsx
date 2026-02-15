import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useAction } from '../../helpers/hooks';
import { createComment } from '../../helpers/backend';

interface CommentFormProps {
  newsId: string;
  parentCommentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  buttonText?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ 
  newsId, 
  parentCommentId, 
  onSuccess, 
  onCancel,
  placeholder = "Write a comment...",
  buttonText = "Post Comment"
}) => {
  const [content, setContent] = useState('');

  const { mutate, isPending } = useAction(createComment, {
    onSuccess: () => {
      setContent('');
      if (onSuccess) onSuccess();
    },
    invalidateKeys: ['comments']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    mutate({
      content,
      newsId,
      parentCommentId
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] focus-visible:ring-red-500"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          className="bg-red-600 hover:bg-red-700 text-white"
          disabled={isPending || !content.trim()}
        >
          {isPending ? 'Posting...' : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
