import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type Category = "UI" | "Performance" | "Feature";
export type Theme = "light" | "dark";

export type Feedback = {
  id: number;
  text: string;
  likes: number;
  dislikes: number;
  date: number;
  category: Category;
};

type State = {
  feedbacks: Feedback[];
  sort: "date" | "popularity";
  filter: Category | "all";
  theme: Theme;
};

type Actions = {
  addFeedback: (text: string, category: Category) => void;
  removeFeedback: (id: number) => void;
  likeFeedback: (id: number) => void;
  dislikeFeedback: (id: number) => void;
  editFeedback: (id: number, text: string, category: Category) => void;
  setSort: (sort: "date" | "popularity") => void;
  setFilter: (filter: Category | "all") => void;
  setTheme: (theme: Theme) => void;
};

export const useFeedbackStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        feedbacks: [],
        sort: "date",
        filter: "all",
        theme: "light",

        addFeedback: (text, category) =>
          set(
            (state) => ({
              feedbacks: [
                {
                  id: Date.now() + Math.random(),
                  text,
                  likes: 0,
                  dislikes: 0,
                  date: Date.now(),
                  category,
                },
                ...state.feedbacks,
              ],
            }),
            false,
            "addFeedback",
          ),
        removeFeedback: (id) =>
          set(
            (state) => ({
              feedbacks: state.feedbacks.filter((fb) => fb.id !== id),
            }),
            false,
            "removeFeedback",
          ),
        likeFeedback: (id) =>
          set(
            (state) => ({
              feedbacks: state.feedbacks.map((fb) =>
                fb.id === id ? { ...fb, likes: fb.likes + 1 } : fb,
              ),
            }),
            false,
            "likeFeedback",
          ),
        dislikeFeedback: (id) =>
          set(
            (state) => ({
              feedbacks: state.feedbacks.map((fb) =>
                fb.id === id ? { ...fb, dislikes: fb.dislikes + 1 } : fb,
              ),
            }),
            false,
            "dislikeFeedback",
          ),
        editFeedback: (id, text, category) =>
          set(
            (state) => ({
              feedbacks: state.feedbacks.map((fb) =>
                fb.id === id ? { ...fb, text, category } : fb,
              ),
            }),
            false,
            "editFeedback",
          ),
        setSort: (sort) => set({ sort }, false, "setSort"),
        setFilter: (filter) => set({ filter }, false, "setFilter"),
        setTheme: (theme) => set({ theme }, false, "setTheme"),
      }),
      { name: "feedback-store" },
    ),
  ),
);
