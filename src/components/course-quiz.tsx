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

const louGrundkursQuestions: CourseQuizQuestion[] = [
  {
    q: 'Vad beskriver bäst en offentlig upphandling?',
    options: ['Ett internt budgetbeslut', 'En reglerad process för att anskaffa varor, tjänster eller byggentreprenader', 'Ett avtal mellan två privata företag', 'Enbart annonseringen av ett inköp'],
    a: 1,
    e: 'Offentlig upphandling omfattar hela anskaffningsprocessen och är inte samma sak som bara annonseringen.'
  },
  {
    q: 'Vilken princip kräver att jämförbara leverantörer behandlas lika?',
    options: ['Proportionalitet', 'Likabehandling', 'Ömsesidigt erkännande', 'Kostnadseffektivitet'],
    a: 1,
    e: 'Likabehandlingsprincipen innebär att leverantörer i jämförbara situationer ska behandlas lika.'
  },
  {
    q: 'Vad är kärnan i proportionalitetsprincipen?',
    options: ['Alla krav måste vara identiska i alla upphandlingar', 'Endast pris får användas', 'Krav får inte vara mer långtgående än vad som behövs för syftet', 'Alla leverantörer måste ha samma omsättning'],
    a: 2,
    e: 'Krav och åtgärder ska stå i rimlig proportion till upphandlingens syfte och omfattning.'
  },
  {
    q: 'Varför gör man en marknadsanalys före annonsering?',
    options: ['För att välja vinnare i förväg', 'För att förstå marknaden, möjliga lösningar, konkurrensen och riskerna innan kraven låses', 'För att slippa uppskatta kontraktsvärdet', 'För att ersätta utvärderingen'],
    a: 1,
    e: 'Marknadsanalysen hjälper organisationen att utforma en konkurrensutsatt och genomförbar upphandling.'
  },
  {
    q: 'Vad ska normalt beaktas när upphandlingens värde uppskattas?',
    options: ['Bara första avtalsåret', 'Bara årets budget', 'Den uppskattade totala ersättningen inklusive relevanta optioner och förlängningar', 'Endast leverantörens vinst'],
    a: 2,
    e: 'Värdet ska beräknas utifrån den totala uppskattade ersättningen, inklusive relevanta optioner och förlängningar.'
  },
  {
    q: 'Vilka två förfaranden över tröskelvärdena enligt LOU kan användas utan särskilda materiella förutsättningar?',
    options: ['Öppet och selektivt förfarande', 'Konkurrenspräglad dialog och direktupphandling', 'Innovationspartnerskap och direktupphandling', 'Förhandlat förfarande utan annonsering och konkurrenspräglad dialog'],
    a: 0,
    e: 'Öppet och selektivt förfarande är de grundläggande förfarandena som kan användas utan att särskilda förutsättningar först behöver vara uppfyllda.'
  },
  {
    q: 'Vad kännetecknar selektivt förfarande?',
    options: ['Alla lämnar fullständiga anbud direkt', 'Det är alltid en direktupphandling', 'Leverantörer ansöker först om att delta och kvalificerade leverantörer bjuds därefter in att lämna anbud', 'Det finns inga kvalificeringskrav'],
    a: 2,
    e: 'Selektivt förfarande har först en ansöknings- och urvalsfas och därefter en anbudsfas.'
  },
  {
    q: 'När kan direktupphandling bland annat användas enligt LOU:s beloppsregel?',
    options: ['När värdet understiger 700 000 kronor', 'När minst tre leverantörer finns', 'När myndigheten helst vill undvika annonsering', 'När kontraktet är längre än två år'],
    a: 0,
    e: 'Från 1 januari 2026 är direktupphandlingsgränsen enligt LOU 700 000 kronor för vanliga varor, tjänster och byggentreprenader. Det finns även andra rättsliga grunder för direktupphandling.'
  },
  {
    q: 'Vad är ett kvalificeringskrav?',
    options: ['Ett krav på leverantörens förmåga eller förutsättningar att fullgöra kontraktet', 'Ett prisavdrag i utvärderingen', 'Ett avtalsvite', 'Ett beslut om vinnare'],
    a: 0,
    e: 'Kvalificeringen gäller leverantörens förutsättningar att delta och fullgöra kontraktet.'
  },
  {
    q: 'Vad är ett obligatoriskt krav på det som upphandlas?',
    options: ['En frivillig bonus', 'En miniminivå som anbudet måste uppfylla', 'Samma sak som ett tilldelningsbeslut', 'Ett krav som först gäller fem år efter avtalsstart'],
    a: 1,
    e: 'Ett obligatoriskt krav fungerar som en tröskel: anbudet måste uppfylla kravet för att kunna godtas.'
  },
  {
    q: 'Vilka tre grunder används över tröskelvärdena för att identifiera det ekonomiskt mest fördelaktiga anbudet?',
    options: ['Pris, omsättning och antal anställda', 'Bästa förhållandet mellan pris och kvalitet, kostnad samt pris', 'Kvalitet, geografi och referenser', 'Pris, dialog och förhandling'],
    a: 1,
    e: 'LOU anger grunderna bästa förhållandet mellan pris och kvalitet, kostnad samt pris.'
  },
  {
    q: 'Vad är ett tilldelningskriterium?',
    options: ['Ett kriterium som används för att jämföra godkända anbud i utvärderingen', 'En regel om vem som får överpröva', 'Ett krav på myndighetens interna organisation', 'En avtalsförlängning'],
    a: 0,
    e: 'Tilldelningskriterier används för att jämföra anbud och identifiera vilket som är ekonomiskt mest fördelaktigt.'
  },
  {
    q: 'Varför bör en utvärderingsmodell testas med hypotetiska anbud före annonsering?',
    options: ['För att kunna byta vinnare senare', 'För att upptäcka oväntade eller orimliga effekter innan modellen blir styrande', 'För att slippa beskriva modellen', 'För att bestämma vilka leverantörer som ska uteslutas'],
    a: 1,
    e: 'Testning gör det möjligt att upptäcka svagheter i modellen innan leverantörerna börjar konkurrera utifrån den.'
  },
  {
    q: 'Vad är ett tilldelningsbeslut?',
    options: ['Samma sak som kontraktet', 'Beslutet om vilken eller vilka leverantörer myndigheten avser att tilldela kontrakt', 'En faktura', 'Ett internt dokument utan betydelse för leverantörer'],
    a: 1,
    e: 'Tilldelningsbeslutet meddelar resultatet av upphandlingen men är inte i sig det slutliga kontraktet.'
  },
  {
    q: 'Vad är huvudsyftet med avtalsspärren?',
    options: ['Att ge myndigheten tid att ändra krav', 'Att ge leverantörer möjlighet att granska tilldelningen och vid behov ansöka om överprövning innan avtal ingås', 'Att stoppa alla leveranser i ett år', 'Att ersätta tilldelningsbeslutet'],
    a: 1,
    e: 'Under avtalsspärren får avtal inte ingås och leverantörer kan ansöka om överprövning.'
  },
  {
    q: 'Hur lång är den normala minsta avtalsspärren när tilldelningsbeslutet skickas elektroniskt?',
    options: ['2 dagar', '5 dagar', '10 dagar', '30 dagar'],
    a: 2,
    e: 'Den normala minsta avtalsspärren är 10 dagar när tilldelningsbeslutet skickas elektroniskt.'
  },
  {
    q: 'Varför bör kvalitet som gav mervärdespoäng i utvärderingen avspeglas i avtalet?',
    options: ['För att den kvalitet som påverkade tilldelningen också ska bli bindande och möjlig att följa upp', 'Det behövs aldrig', 'Bara för att avtalet ska bli längre', 'För att kunna ändra utvärderingen efteråt'],
    a: 0,
    e: 'Annars riskerar organisationen att välja och betala för ett mervärde som inte säkras under leveransen.'
  },
  {
    q: 'Varför kan avtalsändringar vara upphandlingsrättsligt känsliga?',
    options: ['För att ett väsentligt förändrat kontrakt kan avvika från den affär som konkurrensutsattes', 'För att avtal aldrig får ändras', 'För att endast leverantören får föreslå ändringar', 'För att pris aldrig får indexeras'],
    a: 0,
    e: 'Väsentliga förändringar kan innebära att kontraktet i praktiken blivit en annan affär än den som konkurrensutsattes.'
  },
  {
    q: 'Vad behöver en leverantör i förenklad form visa vid en överprövning av upphandlingen?',
    options: ['Bara att leverantören inte vann', 'Ett upphandlingsrättsligt fel och att felet orsakat eller riskerar att orsaka skada', 'Att priset var högre än vinnaren', 'Att myndigheten är offentlig'],
    a: 1,
    e: 'Överprövning bygger i förenklad form på att ett fel enligt regelverket har orsakat eller riskerat att orsaka leverantören skada.'
  },
  {
    q: 'Varför är dokumentation viktig genom hela upphandlingsprocessen?',
    options: ['För att kunna förklara krav, bedömningar, beslut och avtalsändringar i efterhand', 'Bara för arkivering', 'Endast när en leverantör vinner', 'Den är oviktig om projektgruppen minns vad som hände'],
    a: 0,
    e: 'Dokumentation skapar spårbarhet och gör det möjligt att visa hur beslut och bedömningar har gjorts.'
  }
];

export function LouGrundkursQuiz() {
  return (
    <CourseQuiz
      questions={louGrundkursQuestions}
      passPercent={80}
      storageKey="anbudly-lou-grundkurs-slutprov"
    />
  );
}
