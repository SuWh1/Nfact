import FeedbackForm from "../modules/FeedbackForm";
import FeedbackList from "../modules/FeedbackList";
import { useFeedbackStore } from "../store/feedbackStore";
import type { Category } from "../store/feedbackStore";
import React from "react";

const categories: Category[] = ["UI", "Performance", "Feature"];

const FeedbackPage: React.FC = () => {
  const feedbacksRaw = useFeedbackStore((s) => s.feedbacks);
  const filter = useFeedbackStore((s) => s.filter);
  const sort = useFeedbackStore((s) => s.sort);
  const addFeedback = useFeedbackStore((s) => s.addFeedback);
  const removeFeedback = useFeedbackStore((s) => s.removeFeedback);
  const likeFeedback = useFeedbackStore((s) => s.likeFeedback);
  const dislikeFeedback = useFeedbackStore((s) => s.dislikeFeedback);
  const editFeedback = useFeedbackStore((s) => s.editFeedback);
  const setSort = useFeedbackStore((s) => s.setSort);
  const setFilter = useFeedbackStore((s) => s.setFilter);
  const theme = useFeedbackStore((s) => s.theme);
  const setTheme = useFeedbackStore((s) => s.setTheme);

  // useMemo for feedbacks (no infinite rerender)
  const feedbacks = React.useMemo(() => {
    let arr = feedbacksRaw;
    if (filter !== "all") arr = arr.filter((fb) => fb.category === filter);
    if (sort === "popularity") arr = [...arr].sort((a, b) => b.likes - a.likes);
    else arr = [...arr].sort((a, b) => b.date - a.date);
    return arr;
  }, [feedbacksRaw, filter, sort]);

  // Toggle 'dark' class on <html> for Tailwind dark mode
  React.useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-2">
      <div className="shadow-xl rounded-2xl p-8 w-full max-w-2xl flex flex-col gap-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-extrabold">Feedback Board</h1>
          <button
            className="ml-4 px-3 py-1 rounded-full text-xl font-bold transition"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Переключить тему"
            title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <span className="font-semibold">Категория:</span>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded-full border text-sm font-medium transition focus:outline-none ${filter === "all" ? "ring-2 ring-[var(--primary)]" : ""}`}
              style={{
                background:
                  filter === "all" ? "var(--primary)" : "var(--secondary-bg)",
                color: filter === "all" ? "#fff" : "var(--secondary)",
                borderColor:
                  filter === "all" ? "var(--primary)" : "var(--border)",
              }}
              onClick={() => setFilter("all")}
            >
              Все
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1 rounded-full border text-sm font-medium transition focus:outline-none ${filter === cat ? "ring-2 ring-[var(--primary)]" : ""}`}
                style={{
                  background:
                    filter === cat ? "var(--primary)" : "var(--secondary-bg)",
                  color: filter === cat ? "#fff" : "var(--secondary)",
                  borderColor:
                    filter === cat ? "var(--primary)" : "var(--border)",
                }}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="ml-auto font-semibold">
            Всего идей: {feedbacks.length}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Сортировка:</span>
          <select
            className="rounded border px-2 py-1 text-sm transition"
            style={{
              background: "var(--primary-bg)",
              color: "var(--foreground)",
              borderColor: "var(--border)",
            }}
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
          >
            <option value="date">По дате</option>
            <option value="popularity">По популярности</option>
          </select>
        </div>
        <FeedbackForm onAdd={addFeedback} />
        <FeedbackList
          feedbacks={feedbacks}
          onDelete={removeFeedback}
          onLike={likeFeedback}
          onDislike={dislikeFeedback}
          onEdit={editFeedback}
        />
      </div>
    </div>
  );
};

export default FeedbackPage;
