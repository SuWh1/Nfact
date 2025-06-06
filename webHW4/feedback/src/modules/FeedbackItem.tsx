import React, { useState } from "react";
import type { Category } from "../store/feedbackStore";

type FeedbackItemProps = {
  id: number;
  text: string;
  onDelete: () => void;
  likes: number;
  dislikes: number;
  category: Category;
  onLike: () => void;
  onDislike: () => void;
  onEdit: (id: number, text: string, category: Category) => void;
};

const FeedbackItem: React.FC<
  FeedbackItemProps & {
    isEditing?: boolean;
    onStartEdit?: () => void;
    onSaveEdit?: (text: string, category: Category) => void;
  }
> = ({
  id,
  text,
  onDelete,
  likes,
  dislikes,
  category,
  onLike,
  onDislike,
  onEdit,
  isEditing,
  onStartEdit,
  onSaveEdit,
}) => {
  const [editText, setEditText] = useState(text);
  const [editCategory, setEditCategory] = useState<Category>(category);
  React.useEffect(() => {
    if (isEditing) {
      setEditText(text);
      setEditCategory(category);
    }
  }, [isEditing, text, category]);

  return (
    <div className="flex flex-col border rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition group min-h-[64px] w-full">
      <div className="flex items-center mb-2 gap-2">
        <span
          className="text-xs font-bold rounded-full px-3 py-1"
          style={{
            background: "var(--secondary-bg)",
            color: "var(--secondary)",
          }}
        >
          {isEditing ? (
            <select
              className="rounded px-2 py-1 text-xs"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as Category)}
            >
              {(["UI", "Performance", "Feature"] as Category[]).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          ) : (
            category
          )}
        </span>
        {isEditing ? null : (
          <button
            className="ml-auto text-xs font-medium rounded-full px-3 py-1 transition hover:opacity-80"
            style={{ background: "var(--primary-bg)", color: "var(--primary)" }}
            onClick={onStartEdit}
          >
            Редактировать
          </button>
        )}
      </div>
      {isEditing ? (
        <>
          <input
            className="font-medium break-words whitespace-pre-line w-full mb-4 rounded border px-2 py-1"
            style={{
              background: "var(--primary-bg)",
              color: "var(--foreground)",
              borderColor: "var(--border)",
            }}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button
            className="rounded-full px-3 py-1 transition font-bold mb-4"
            style={{ background: "var(--primary)", color: "#fff" }}
            onClick={() => onSaveEdit && onSaveEdit(editText, editCategory)}
            disabled={!editText.trim()}
          >
            Ок
          </button>
        </>
      ) : (
        <span className="font-medium break-words whitespace-pre-line w-full mb-4">
          {text}
        </span>
      )}
      <div className="flex flex-row items-center gap-2 w-full">
        <button
          className="rounded-full px-3 py-1 transition font-bold"
          style={{ background: "var(--primary-bg)", color: "var(--primary)" }}
          onClick={onLike}
          aria-label="Лайк"
          disabled={isEditing}
        >
          👍 {likes}
        </button>
        <button
          className="rounded-full px-3 py-1 transition font-bold"
          style={{ background: "var(--primary-bg)", color: "var(--primary)" }}
          onClick={onDislike}
          aria-label="Дизлайк"
          disabled={isEditing}
        >
          👎 {dislikes}
        </button>
        <button
          className="ml-auto text-xs font-bold rounded-full px-3 py-1 shadow transition"
          style={{ background: "#dc2626", color: "#fff" }}
          onClick={onDelete}
          aria-label="Удалить фидбек"
          disabled={isEditing}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

export default FeedbackItem;
