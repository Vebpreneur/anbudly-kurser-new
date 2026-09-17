'use client';

import * as React from 'react';
import { CheckCircle2, CircleAlert, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export type CourseQuizQuestion = {
  q: string;
  options: string[];
  a: number;
  e: string;
};

type CourseQuizProps = {
  questions: CourseQuizQuestion[];
  passPercent?: number;
  storageKey?: string;
};

type SavedResult = {
  score: number;
  total: number;
  passed: boolean;
};

export function CourseQuiz({
  questions,
  passPercent = 80,
  storageKey,
}: CourseQuizProps) {
  const [answers, setAnswers] = React.useState<(number | null)[]>(() =>
    Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = React.useState(false);
  const [saved, setSaved] = React.useState<SavedResult | null>(null);

  React.useEffect(() => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    if (!storageKey) return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      setSaved(raw ? (JSON.parse(raw) as SavedResult) : null);
    } catch {
      setSaved(null);
    }
  }, [questions.length, storageKey]);

  const answered = answers.filter((value) => value !== null).length;
  const complete = questions.length > 0 && answered === questions.length;
  const score = questions.reduce(
    (total, question, index) => total + (answers[index] === question.a ? 1 : 0),
    0
  );
  const threshold = Math.ceil(questions.length * (passPercent / 100));
  const passed = score >= threshold;

  function choose(questionIndex: number, optionIndex: number) {
    if (submitted) return;
    setAnswers((current) => {
      const next = [...current];
      next[questionIndex] = optionIndex;
      return next;
    });
  }

  function submit() {
    if (!complete) return;
    setSubmitted(true);
    const result = { score, total: questions.length, passed };
    setSaved((previous) => {
      const best = !previous || score > previous.score ? result : previous;
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(best));
        } catch {}
      }
      return best;
    });
  }

  function reset() {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
  }

  return (
    <section className="my-8 overflow-hidden rounded-xl border bg-card">
      <div className="border-b bg-muted/30 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge>Självrättande slutprov</Badge>
              <Badge variant="outline">{passPercent} % för godkänt</Badge>
            </div>
            <h2 className="m-0 text-xl font-semibold">Testa dina kunskaper</h2>
            <p className="mt-2 mb-0 text-sm text-muted-foreground">
              Besvara alla frågor och välj sedan Rätta provet. Du får direkt återkoppling på varje svar.
            </p>
            {saved && (
              <p className="mt-2 mb-0 text-xs text-muted-foreground">
                Bästa sparade resultat: {saved.score}/{saved.total}
                {saved.passed ? ' · godkänt' : ''}
              </p>
            )}
          </div>
          <div className="min-w-28 text-right">
            <div className="text-sm font-medium">{answered}/{questions.length}</div>
            <div className="text-xs text-muted-foreground">besvarade</div>
          </div>
        </div>
        <Progress
          value={questions.length ? (answered / questions.length) * 100 : 0}
          className="mt-4"
        />
      </div>

      <div className="divide-y">
        {questions.map((question, qi) => (
          <div key={qi} className="p-5 sm:p-6">
            <p className="mt-0 mb-4 font-medium leading-6">
              {qi + 1}. {question.q}
            </p>
            <div className="grid gap-2">
              {question.options.map((option, oi) => {
                const selected = answers[qi] === oi;
                const correct = submitted && oi === question.a;
                const wrongSelected = submitted && selected && oi !== question.a;

                return (
                  <label
                    key={oi}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors',
                      !submitted && 'hover:border-primary/50 hover:bg-muted/30',
                      selected && !submitted && 'border-primary bg-primary/5',
                      correct && 'border-green-500/60 bg-green-500/5',
                      wrongSelected && 'border-destructive/60 bg-destructive/5',
                      submitted && 'cursor-default'
                    )}
                  >
                    <input
                      type="radio"
                      name={`course-question-${qi}`}
                      checked={selected}
                      onChange={() => choose(qi, oi)}
                      disabled={submitted}
                      className="mt-1 size-4 accent-current"
                    />
                    <span className="leading-6">{option}</span>
                  </label>
                );
              })}
            </div>

            {submitted && (
              <div
                className={cn(
                  'mt-4 flex items-start gap-3 rounded-lg border p-4 text-sm',
                  answers[qi] === question.a
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-destructive/30 bg-destructive/5'
                )}
              >
                {answers[qi] === question.a ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                )}
                <div>
                  <strong>{answers[qi] === question.a ? 'Rätt.' : 'Inte rätt.'}</strong>{' '}
                  {question.e}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t bg-muted/20 p-5 sm:p-6">
        {!submitted ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {complete
                ? 'Alla frågor är besvarade.'
                : `${questions.length - answered} frågor återstår.`}
            </div>
            <Button type="button" onClick={submit} disabled={!complete}>
              Rätta provet
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">
                {score}/{questions.length} rätt · {Math.round((score / questions.length) * 100)} %
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {passed
                  ? 'Godkänt. Du har klarat kursens slutprov.'
                  : `Inte godkänt ännu. Minst ${threshold} rätt krävs. Repetera de områden du missade och försök igen.`}
              </div>
            </div>
            <Button type="button" variant="outline" onClick={reset}>
              <RotateCcw />
              Gör om provet
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
