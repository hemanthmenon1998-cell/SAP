import { createClient } from "@/lib/supabase/server";

export type LessonRow = { id: string; module_id: string; slug: string; title: string; estimated_minutes: number; sort_order: number; difficulty: string };
export type ModuleRow = { id: string; slug: string; title: string; summary: string | null; sort_order: number };
export type ProgressRow = { lesson_id: string; status: string; sections_read: number; quiz_passed: boolean; practical_completed: boolean };

export async function loadCurriculum() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [mods, lessons, progress] = await Promise.all([
    supabase.from("modules").select("id, slug, title, summary, sort_order").eq("status", "published").order("sort_order"),
    supabase.from("lessons").select("id, module_id, slug, title, estimated_minutes, sort_order, difficulty").eq("status", "published").order("sort_order"),
    supabase.from("lesson_progress").select("lesson_id, status, sections_read, quiz_passed, practical_completed").eq("user_id", user!.id),
  ]);
  const modules = (mods.data ?? []) as ModuleRow[];
  const allLessons = (lessons.data ?? []) as LessonRow[];
  const progressMap = new Map<string, ProgressRow>(((progress.data ?? []) as ProgressRow[]).map((p) => [p.lesson_id, p]));
  return { modules, lessons: allLessons, progressMap };
}
