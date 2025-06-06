import React from "react";

type FeedbackFormProps = {
  value: string;
  onChange: (v: string) => void;
  onAdd: () => void;
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  value,
  onChange,
  onAdd,
}) => {
  return (
    <div className="flex gap-2">
      <input
        className="flex-1 px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        type="text"
        placeholder="Ваш фидбек..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onAdd();
        }}
      />
      <button
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-5 py-2 rounded-lg shadow transition disabled:opacity-50"
        onClick={onAdd}
        disabled={!value.trim()}
      >
        Добавить
      </button>
    </div>
  );
};

export default FeedbackForm;
