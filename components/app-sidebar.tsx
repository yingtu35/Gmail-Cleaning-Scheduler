import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/logo.svg';
import {
  BarChartIcon,
  House,
  SettingsIcon,
  Github,
} from "lucide-react"
import {
  SidebarMain,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';

import { User } from 'next-auth';

const navItems = [
  { title: 'Home',
    href: '/',
    icon: House,
  },
  { title: 'Statistics (Coming Soon)', 
    href: '/',
    icon: BarChartIcon,
  },
];

const navSecondary = [
  { title: 'Settings', 
    href: '/',
    icon: SettingsIcon, 
  },
  { title: 'GitHub',
    href: 'https://github.com/yingtu35/Gmail-Cleaning-Scheduler',
    icon: Github,
    target: '_blank',
    rel: 'noopener noreferrer',
  }
]

const SideBarLogo = Object.freeze({
  alt: "Gmail Cleaner",
  width: 300,
  height: 300,
});

export async function AppSidebar({
  user,
  className,
}: {
  user: ({
    id?: string;
} & User) | null,
  className?: string,
}) {
  return (
    <SidebarMain className={className}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='bg-sidebar hover:bg-sidebar-accent'>
            <Link href="/">
              <Image
                src={logo}
                alt={SideBarLogo.alt}
                width={SideBarLogo.width}
                height={SideBarLogo.height}
              />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </SidebarMain>
  );
};