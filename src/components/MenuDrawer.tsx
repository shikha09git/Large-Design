import React from 'react';
import { Drawer, DrawerTrigger, DrawerContent } from './ui/drawer';
import { ThemeToggle } from './ThemeToggle';

export function MenuDrawer({ onLogout }: { onLogout: () => void }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button aria-label="Open menu" className="flex flex-col justify-center items-center w-10 h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <span className="block w-6 h-0.5 bg-blue-500 rounded mb-1"></span>
          <span className="block w-6 h-0.5 bg-blue-500 rounded mb-1"></span>
          <span className="block w-6 h-0.5 bg-blue-500 rounded"></span>
        </button>
      </DrawerTrigger>
      <DrawerContent className="p-6 flex flex-col gap-4 w-60 bg-white dark:bg-gray-800">
        <ThemeToggle />
        <button
          onClick={onLogout}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded px-4 py-2 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Logout
        </button>
      </DrawerContent>
    </Drawer>
  );
}
