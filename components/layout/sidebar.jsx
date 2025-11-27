'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Kanban, Trophy, User ,Plus } from 'lucide-react'
import useAuth from '../../hooks/userAPI'

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname()
  const { user } = useAuth()

  const baseNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/dashboard/kanban', label: 'Kanban Board', icon: Kanban },
    { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
        

  ]
let navItems;

if (user?.role === "client") {
  navItems = [
    ...baseNavItems,
    { href: "/dashboard/projects", label: "Add Project", icon: Plus },
  ];
} 
else if (user?.role === "pm") {
  navItems = [
    ...baseNavItems,
    { href: "/dashboard/assignTask", label: "Create New Task", icon: Plus },
  ];
}
else {
  navItems = [...baseNavItems];
}

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:sticky top-20 left-0 h-screen w-64 border-r border-slate-700 bg-slate-900/30 overflow-y-auto
        transform transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <nav className="p-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm sm:text-base ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-500 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
