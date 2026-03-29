import Link from "next/link";
import { Code2, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-glass-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <Link href="/" className="text-lg font-bold font-display bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
            Parth Verma
          </Link>
          <p className="text-sm text-slate-500 mt-1">
            Building the web, one pixel at a time.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/Parthverma2409"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Code2 size={20} />
          </a>
          <a
            href="mailto:parthverma2409@gmail.com"
            className="text-slate-500 hover:text-foreground transition-colors"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </div>

        <p className="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Parth Verma. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
