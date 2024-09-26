import React from 'react';
import { auth } from '@/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import Profile from './Profile';
import Logo from './Logo';

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
        <nav className="mt-10">
          <ul>
            <li>
              <Link href="/">
                <Button variant="ghost" className="w-full text-left">
                  Home
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/statistics">
                <Button variant="ghost" className="w-full text-left">
                  Statistics
                </Button>
              </Link>
            </li>
            {/* <li className="mt-2">
              <Link href="/settings">
                <Button variant="ghost" className="w-full text-left">
                  Settings
                </Button>
              </Link>
            </li>
            <li className="mt-2">
              <Link href="/profile">
                <Button variant="ghost" className="w-full text-left">
                  Profile
                </Button>
              </Link>
            </li> */}
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
