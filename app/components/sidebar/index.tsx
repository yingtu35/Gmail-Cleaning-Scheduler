import React from 'react';
import { auth } from '@/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import Profile from './Profile';
import Logo from './Logo';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface SideBarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const SideBarButton = ({ children, ...props }: SideBarButtonProps) => {
  return (
    <Button variant="ghost" className="w-full text-left py-8 text-md" {...props}>
      {children}
    </Button>
  );
};


async function Sidebar() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="flex flex-col justify-between h-screen w-64 bg-gray-800 text-white">
      {/* Top Section */}
      <div className="p-4">
        <div className="bg-white p-1">
          <Logo />
        </div>
        <div className="text-center mt-4 text-sm text-gray-400 hover:text-white">
        <a href='https://github.com/yingtu35/Gmail-Cleaning-Scheduler' target="_blank" rel="noopener noreferrer">
          Github
        </a>
        </div>
        <nav className="mt-10">
          <ul>
            <li>
              <Link href="/">
                <SideBarButton>
                  Home
                </SideBarButton>
              </Link>
            </li>
            <li>
              <SideBarButton disabled>
                Statistics (Coming Soon)
              </SideBarButton>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 flex items-center border-t border-gray-700">
        <Profile user={user} />
      </div>
    </div>
  );
};

export default Sidebar;
