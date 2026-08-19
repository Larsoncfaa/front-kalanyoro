import { useCallback, useEffect, useState } from "react";

import {
  getCurriculumModules,
  getCurriculumModule,
  createCurriculumModule,
  updateCurriculumModule,
  deleteCurriculumModule,
  type CurriculumModule,
} from "../api/curriculum.api";

export function useCurriculumModules(
  initialParams?: {
    level?: number;
  }
) {
  const [modules, setModules] = useState<CurriculumModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCurriculumModules(initialParams);
      setModules(data);
    } catch (err: any) {
      setError(
        err?.message ||
          "Impossible de charger les modules du curriculum"
      );
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    load();
  }, [load]);

  const getModule = async (id: number) => {
    return await getCurriculumModule(id);
  };

  const createModule = async (payload: {
    level: number;
    title: string;
    description: string;
    order: number;
    duration_minutes: number;
    is_required: boolean;
  }) => {
    const module = await createCurriculumModule(payload);
    await load();
    return module;
  };

  const updateModule = async (
    id: number,
    payload: Partial<{
      level: number;
      title: string;
      description: string;
      order: number;
      duration_minutes: number;
      is_required: boolean;
    }>
  ) => {
    const module = await updateCurriculumModule(id, payload);
    await load();
    return module;
  };

  const deleteModule = async (id: number) => {
    const deleted = await deleteCurriculumModule(id);

    if (deleted) {
      await load();
    }

    return deleted;
  };

  return {
    modules,
    loading,
    error,
    reload: load,
    getModule,
    createModule,
    updateModule,
    deleteModule,
  };
}