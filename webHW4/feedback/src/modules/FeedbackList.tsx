import React from "react";
import FeedbackItem from "./FeedbackItem";
import type { Feedback, Category } from "../store/feedbackStore";

type FeedbackListProps = {
  feedbacks: Feedback[];
  onDelete: (id: number) => void;
  onLike: (id: number) => void;
  onDislike: (id: number) => void;
  onEdit: (id: number, text: string, category: Category) => void;
};

const FeedbackList: React.FC<FeedbackListProps> = ({
  feedbacks,
  onDelete,
  onLike,
  onDislike,
  onEdit,
}) => {
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const handleStartEdit = (id: number) => setEditingId(id);
  const handleSaveEdit = (id: number, text: string, category: Category) => {
    onEdit(id, text, category);
    setEditingId(null);
  };
  if (feedbacks.length === 0) {
    return (
      <div className="text-gray-400 text-center">
        Нет фидбеков. Будь первым!
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 mt-4">
      {feedbacks.map((fb) => (
        <FeedbackItem
          key={fb.id}
          id={fb.id}
          text={fb.text}
          likes={fb.likes}
          dislikes={fb.dislikes}
          category={fb.category}
          onDelete={() => onDelete(fb.id)}
          onLike={() => onLike(fb.id)}
          onDislike={() => onDislike(fb.id)}
          onEdit={onEdit}
          isEditing={editingId === fb.id}
          onStartEdit={() => handleStartEdit(fb.id)}
          onSaveEdit={(text, category) => handleSaveEdit(fb.id, text, category)}
        />
      ))}
    </div>
  );
};

export default FeedbackList;
