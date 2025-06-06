import { useState } from "react";
import FeedbackForm from "../modules/FeedbackForm.tsx";
import FeedbackList from "../modules/FeedbackList.tsx";

function App() {
  const [feedbacks, setFeedbacks] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addFeedback = () => {
    if (input.trim()) {
      setFeedbacks([input, ...feedbacks]);
      setInput("");
    }
  };

  const removeFeedback = (idx: number) => {
    setFeedbacks(feedbacks.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center py-12 px-2">
      <div className="bg-white/80 shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-center text-purple-700 mb-2">
          Feedback Board
        </h1>
        <FeedbackForm value={input} onChange={setInput} onAdd={addFeedback} />
        <FeedbackList feedbacks={feedbacks} onDelete={removeFeedback} />
      </div>
    </div>
  );
}

export default App;
