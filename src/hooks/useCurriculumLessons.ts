import { useCallback, useEffect, useState } from "react";

import {
  getCurriculumLessons,
  getCurriculumLesson,
  createCurriculumLesson,
  updateCurriculumLesson,
  deleteCurriculumLesson,
  type CurriculumLesson,
} from "../api/curriculum.api";

export function useCurriculumLessons(
  initialParams?: {
    module?: number;
  }
) {
  const [lessons, setLessons] = useState<CurriculumLesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCurriculumLessons(initialParams);
      setLessons(data);
    } catch (err: any) {
      setError(
        err?.message ||
          "Impossible de charger les leçons du curriculum"
      );
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    load();
  }, [load]);

  const getLesson = async (id: number) => {
    return await getCurriculumLesson(id);
  };

  const createLesson = async (payload: {
    module: number;
    title: string;
    objectives: string;
    description: string;
    order: number;
    duration_minutes: number;
    is_required: boolean;
    content: string;
  }) => {
    const lesson = await createCurriculumLesson(payload);
    await load();
    return lesson;
  };

  const updateLesson = async (
    id: number,
    payload: Partial<{
      module: number;
      title: string;
      objectives: string;
      description: string;
      order: number;
      duration_minutes: number;
      is_required: boolean;
      content: string;
    }>
  ) => {
    const lesson = await updateCurriculumLesson(id, payload);
    await load();
    return lesson;
  };

  const deleteLesson = async (id: number) => {
    const deleted = await deleteCurriculumLesson(id);

    if (deleted) {
      await load();
    }

    return deleted;
  };

  return {
    lessons,
    loading,
    error,
    reload: load,
    getLesson,
    createLesson,
    updateLesson,
    deleteLesson,
  };
}