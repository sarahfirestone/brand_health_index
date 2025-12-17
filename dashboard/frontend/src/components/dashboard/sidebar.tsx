'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Flag,
  Home,
  Map,
  Rss,
  Twitter,
  TrendingUp
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Awareness & Consideration', href: '/dashboard/awareness', icon: Map },
  { name: 'Engagement', href: '/dashboard/engagement', icon: TrendingUp },
  { name: 'Complaints', href: '/dashboard/complaints', icon: Flag },
  { name: 'Twitter/X Sentiment', href: '/dashboard/tweets', icon: Twitter },
  { name: 'News Advocacy', href: '/dashboard/advocacy', icon: Rss },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex-shrink-0 flex flex-col bg-[#F5F3EE] border-r border-[#D4C4B0] w-16">
      {/* Navigation */}
      <nav className="flex-1 px-2 py-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <div key={item.name}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center justify-center p-3 rounded-md transition-all duration-200 group',
                          isActive
                            ? 'bg-[#3C8825] text-white'
                            : 'text-gray-600 hover:text-[#3C8825] hover:bg-[#3C8825]/10'
                        )}
                      >
                        <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer Info */}
      <div className="px-2 pb-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center p-3 rounded-md text-gray-400 cursor-default">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
              <p className="text-xs">Last updated: {new Date().toLocaleString()}</p>
              <p className="text-xs mt-1">Data from Reddit & CFPB</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
