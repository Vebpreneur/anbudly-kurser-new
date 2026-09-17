'use client';

import React from 'react';
import Link from 'next/link';
import { allDocs } from 'contentlayer/generated';
import SearchDialog from '@/components/search-dialog';
import { sidebarNav } from 'config/sidebar';
import {
  SidebarProvider,
  SidebarLayout,
  MainContent,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeaderTitle,
  NestedLink,
} from '@/components/sidebar';
import Header from '@/components/header';
import { ModeToggle } from '@/components/mode-toggle';
import { useIsMobile } from '@/hooks/use-mobile';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <SidebarLayout>
      <SidebarProvider
        defaultOpen={isMobile ? false : true}
        defaultSide="left"
        defaultMaxWidth={280}
        showIconsOnCollapse={true}
      >
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex flex-1 items-center px-2">
              <SidebarHeaderTitle>Anbudly Kurser</SidebarHeaderTitle>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            {sidebarNav.map((section) => (
              <SidebarMenuItem
                isCollapsable={section.pages.length > 0}
                key={section.title}
                label={section.title}
                href={'href' in section ? section.href : undefined}
                icon={section.icon}
                defaultOpen={section.defaultOpen}
              >
                {section.pages.map((page) => (
                  <NestedLink key={page.href} href={page.href}>
                    {page.title}
                  </NestedLink>
                ))}
              </SidebarMenuItem>
            ))}
          </SidebarContent>
        </Sidebar>

        <MainContent>
          <Header className="justify-between py-2">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Anbudly Kurser</h1>
            </div>
            <div className="flex items-center gap-2 pr-0 lg:pr-8">
              <SearchDialog searchData={allDocs} />
              <ModeToggle />
            </div>
          </Header>
          <main className="overflow-auto p-6">{children}</main>
        </MainContent>
      </SidebarProvider>
    </SidebarLayout>
  );
}
