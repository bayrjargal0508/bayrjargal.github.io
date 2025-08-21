"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-0 bg-black">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className=""
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

       
        <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-12 ">
          <Link href="/" className="hover:text-blue-600 font-mono">
            Home
          </Link>
          <Link href="#about" className="hover:text-blue-600 font-mono">
            About
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col space-y-2 p-4 ">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link href="/about" className="hover:text-blue-600">
              About
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
