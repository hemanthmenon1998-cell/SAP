import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LessonView from "@/components/LessonView";

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: lesson } = await supabase.from("lessons").select("id, title, learning_objective, estimated_minutes, difficulty").eq("slug", params.slug).eq("status", "published").maybeSingle();
  if (!lesson) notFound();

  const [sections, quiz, progress] = await Promise.all([
    supabase.from("lesson_sections").select("id, section_type, title, body, is_required, sort_order").eq("lesson_id", lesson.id).order("sort_order"),
    supabase.from("quizzes").select("id, pass_threshold").eq("lesson_id", lesson.id).eq("kind", "lesson").eq("status", "published").maybeSingle(),
    supabase.from("lesson_progress").select("sections_read, quiz_passed, practical_completed, status").eq("user_id", user!.id).eq("lesson_id", lesson.id).maybeSingle(),
  ]);

  let questions: any[] = [];
  if (quiz.data) {
    const { data: qq } = await supabase.from("quiz_questions").select("sort_order, questions(id, prompt, question_type, question_options(id, label, sort_order))").eq("quiz_id", quiz.data.id).order("sort_order");
    questions = (qq ?? []).map((row: any) => ({
      id: row.questions.id, prompt: row.questions.prompt, type: row.questions.question_type,
      options: [...row.questions.question_options].sort((a: any, b: any) => a.sort_order - b.sort_order),
    }));
  }

  return (
    <LessonView
      lesson={lesson}
      sections={sections.data ?? []}
      quizId={quiz.data?.id ?? null}
      passThreshold={quiz.data?.pass_threshold ?? 70}
      questions={questions}
      initial={progress.data ?? { sections_read: 0, quiz_passed: false, practical_completed: false, status: "not_started" }}
    />
  );
}
