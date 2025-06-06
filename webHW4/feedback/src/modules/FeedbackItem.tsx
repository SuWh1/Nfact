import React from "react";

type FeedbackItemProps = {
  text: string;
  onDelete: () => void;
};

const FeedbackItem: React.FC<FeedbackItemProps> = ({ text, onDelete }) => {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition group">
      <span className="text-gray-800 font-medium break-words flex-1">
        {text}
      </span>
      <button
        className="ml-4 text-xs text-white bg-red-400 hover:bg-red-600 rounded-lg px-3 py-1 font-bold shadow group-hover:scale-105 transition"
        onClick={onDelete}
        aria-label="Удалить фидбек"
      >
        Удалить
      </button>
    </div>
  );
};

export default FeedbackItem;
