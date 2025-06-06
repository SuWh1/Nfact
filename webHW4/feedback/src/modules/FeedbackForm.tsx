import React, { useState } from "react";
import type { Category } from "../store/feedbackStore";

type FeedbackFormProps = {
  onAdd: (text: string, category: Category) => void;
};

const categories: Category[] = ["UI", "Performance", "Feature"];

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onAdd }) => {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  const handleAdd = () => {
    if (input.trim() && category) {
      onAdd(input, category as Category);
      setInput("");
    }
  };

  return (
    <div className="flex gap-2 flex-wrap items-center">
      <input
        className="flex-1 px-4 py-2 rounded-lg border transition"
        style={{
          background: "var(--primary-bg)",
          color: "var(--foreground)",
          borderColor: "var(--border)",
        }}
        type="text"
        placeholder="Ваш фидбек..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
        }}
      />
      <select
        className="rounded border px-2 py-2 text-sm transition"
        style={{
          background: "var(--primary-bg)",
          color: "var(--foreground)",
          borderColor: "var(--border)",
        }}
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
      >
        <option value="" disabled>
          Выберите категорию
        </option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <button
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-5 py-2 rounded-lg shadow transition disabled:opacity-50"
        onClick={handleAdd}
        disabled={!input.trim() || !category}
      >
        Добавить
      </button>
    </div>
  );
};

export default FeedbackForm;
