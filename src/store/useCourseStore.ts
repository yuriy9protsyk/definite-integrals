"use client";

import { create } from "zustand";

export type XRayVarId =
  | "var-a"
  | "var-b"
  | "var-fx"
  | "var-dx"
  | "var-xi"
  | "var-tau"
  | "var-sigma"
  | "var-F"
  | "var-c"
  | "var-k"
  | "var-mu"
  | "var-phi"
  | "var-alpha"
  | "var-beta"
  | "var-u"
  | "var-dv"
  | "var-v"
  | "var-du"
  | "var-sym";

export type ThemeMode = "dark" | "light";

interface CourseState {
  activeModuleId: string;
  hoveredVar: XRayVarId | null;
  pinnedVar: XRayVarId | null;
  searchQuery: string;
  theme: ThemeMode;
  blindCheatSheet: boolean;
  revealedCheatIds: Record<string, boolean>;
  completedQuizIds: Record<string, boolean>;
  quizAnswers: Record<string, string>;
  visitedModules: Record<string, boolean>;

  setActiveModuleId: (id: string) => void;
  setHoveredVar: (varId: XRayVarId | null) => void;
  togglePinnedVar: (varId: XRayVarId) => void;
  clearActiveVar: () => void;
  setSearchQuery: (query: string) => void;
  toggleTheme: () => void;
  toggleBlindCheatSheet: () => void;
  toggleRevealCheat: (id: string) => void;
  recordQuizAnswer: (questionId: string, optionId: string, isCorrect: boolean) => void;
  resetQuizQuestion: (questionId: string) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  activeModuleId: "riemann-integral",
  hoveredVar: null,
  pinnedVar: null,
  searchQuery: "",
  theme: "dark",
  blindCheatSheet: false,
  revealedCheatIds: {},
  completedQuizIds: {},
  quizAnswers: {},
  visitedModules: {
    "riemann-integral": true,
  },

  setActiveModuleId: (id) =>
    set((state) => ({
      activeModuleId: id,
      hoveredVar: null,
      pinnedVar: null,
      visitedModules: { ...state.visitedModules, [id]: true },
    })),

  setHoveredVar: (varId) => set({ hoveredVar: varId }),

  togglePinnedVar: (varId) =>
    set((state) => ({
      pinnedVar: state.pinnedVar === varId ? null : varId,
    })),

  clearActiveVar: () => set({ hoveredVar: null, pinnedVar: null }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    })),

  toggleBlindCheatSheet: () =>
    set((state) => ({
      blindCheatSheet: !state.blindCheatSheet,
      revealedCheatIds: {},
    })),

  toggleRevealCheat: (id) =>
    set((state) => ({
      revealedCheatIds: {
        ...state.revealedCheatIds,
        [id]: !state.revealedCheatIds[id],
      },
    })),

  recordQuizAnswer: (questionId, optionId, isCorrect) =>
    set((state) => ({
      quizAnswers: { ...state.quizAnswers, [questionId]: optionId },
      completedQuizIds: isCorrect
        ? { ...state.completedQuizIds, [questionId]: true }
        : state.completedQuizIds,
    })),

  resetQuizQuestion: (questionId) =>
    set((state) => {
      const nextAnswers = { ...state.quizAnswers };
      delete nextAnswers[questionId];
      return { quizAnswers: nextAnswers };
    }),
}));

export function selectEffectiveVar(state: CourseState): XRayVarId | null {
  return state.hoveredVar ?? state.pinnedVar;
}
