'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Search, Sparkles } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const categories = [
  ['Grunder', 'LOU, principer, process och begrepp.'],
  ['Avtal & uppföljning', 'Avtalsvillkor, uppföljning och leverans.'],
  ['Juridik', 'Rättsmedel, sekretess och juridisk tillämpning.'],
  ['Specialområden', 'Fördjupning inom särskilda upphandlingsområden.'],
  ['Leverantör', 'Att hitta, bedöma och vinna offentliga affärer.'],
  ['Regelefterlevnad & framtid', 'Nya krav, hållbarhet, AI och förändrad reglering.'],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Anbudly Kurser
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/docs/kurser">Kurser</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/docs/anbudly-ai">Anbudly AI</Link>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main>
        <section className="border-b">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-6">Offentlig upphandling</Badge>
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                Kurser för dig som arbetar med offentliga affärer
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Fördjupa dig i offentlig upphandling genom strukturerade, textbaserade kurser med exempel, kontrollfrågor, praktiska fall och tydliga vägar vidare.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/docs/kurser/lou-grundkurs">
                    Börja med LOU <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/docs/kurser">
                    <Search /> Se alla kurser
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">Utforska efter område</h2>
            <p className="mt-2 text-muted-foreground">Kurserna organiseras efter det arbete du faktiskt behöver kunna utföra.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map(([title, description]) => (
              <Card key={title}>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y bg-muted/30">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 py-16 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="size-4" /> Referenskurs
                </div>
                <CardTitle>Grundkurs i LOU</CardTitle>
                <CardDescription>
                  Från principerna bakom lagen till krav, utvärdering, avtal och rättsmedel.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>10 delar</span><span>Grundnivå</span>
                  </div>
                  <Progress value={10} />
                </div>
                <Button asChild variant="outline">
                  <Link href="/docs/kurser/lou-grundkurs">Öppna kursen <ArrowRight /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="size-4" /> Anbudly AI
                </div>
                <CardTitle>Fråga medan du lär dig</CardTitle>
                <CardDescription>
                  AI-stödet byggs in som ett komplement till kursinnehållet så att frågor kan kopplas till rätt del av materialet.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> Förklara begrepp och resonemang.</p>
                <p className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> Hitta relevant kursdel snabbare.</p>
                <p className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> Ställ följdfrågor på det du läser.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
