'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, LogOut, User, Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">MedAnalyzer</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>Welcome, {user?.name}</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600 px-2">
                <User className="h-4 w-4" />
                <span>Welcome, {user?.name}</span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}