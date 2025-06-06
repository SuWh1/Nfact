import React from "react";
import FeedbackItem from "./FeedbackItem";

type FeedbackListProps = {
  feedbacks: string[];
  onDelete: (idx: number) => void;
};

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks, onDelete }) => {
  if (feedbacks.length === 0) {
    return (
      <div className="text-gray-400 text-center">
        Нет фидбеков. Будь первым!
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 mt-4">
      {feedbacks.map((fb, idx) => (
        <FeedbackItem key={idx} text={fb} onDelete={() => onDelete(idx)} />
      ))}
    </div>
  );
};

export default FeedbackList;
