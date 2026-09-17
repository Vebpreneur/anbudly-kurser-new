import {
  BookOpen,
  BriefcaseBusiness,
  FileCheck2,
  Landmark,
  Scale,
  ShieldCheck,
} from 'lucide-react';

export const sidebarNav = [
  {
    title: 'Grunder',
    icon: <BookOpen className="h-5 w-5" />,
    defaultOpen: true,
    pages: [
      { title: 'Alla kurser', href: '/docs/kurser' },
      { title: 'Grundkurs i LOU', href: '/docs/kurser/lou-grundkurs' },
      { title: '1. Grunder och begrepp', href: '/docs/kurser/lou-grundkurs/01-grunder' },
      { title: '2. Grundprinciperna', href: '/docs/kurser/lou-grundkurs/02-principer' },
      { title: '3. Planering', href: '/docs/kurser/lou-grundkurs/03-planering' },
      { title: '4. Förfarande', href: '/docs/kurser/lou-grundkurs/04-forfarande' },
      { title: '5. Krav', href: '/docs/kurser/lou-grundkurs/05-krav' },
      { title: '6. Utvärdering', href: '/docs/kurser/lou-grundkurs/06-utvardering' },
      { title: '7. Avtal', href: '/docs/kurser/lou-grundkurs/07-avtal' },
      { title: '8. Rättsmedel', href: '/docs/kurser/lou-grundkurs/08-rattsmedel' },
      { title: '9. Praktiskt fall', href: '/docs/kurser/lou-grundkurs/09-praktiskt-fall' },
      { title: '10. Modellösning', href: '/docs/kurser/lou-grundkurs/10-modellosning' },
      { title: '11. Slutprov', href: '/docs/kurser/lou-grundkurs/11-slutprov' },
    ],
  },
  {
    title: 'Avtal & uppföljning',
    icon: <FileCheck2 className="h-5 w-5" />,
    defaultOpen: false,
    pages: [],
  },
  {
    title: 'Juridik',
    icon: <Scale className="h-5 w-5" />,
    defaultOpen: false,
    pages: [],
  },
  {
    title: 'Specialområden',
    icon: <Landmark className="h-5 w-5" />,
    defaultOpen: false,
    pages: [],
  },
  {
    title: 'Leverantör',
    icon: <BriefcaseBusiness className="h-5 w-5" />,
    defaultOpen: false,
    pages: [],
  },
  {
    title: 'Regelefterlevnad & framtid',
    icon: <ShieldCheck className="h-5 w-5" />,
    defaultOpen: false,
    pages: [
      { title: 'Anbudly AI', href: '/docs/anbudly-ai' },
    ],
  },
];
