
import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 pb-12" id="contact">
        <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-24 text-center text-slate-500 dark:text-slate-400">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Let's Connect</h3>
                <p className="max-w-xl mx-auto">I’m open to freelance projects, collaborations, or full-time roles in AI, Web3, and full-stack development.</p>
            </div>
            <div className="flex justify-center space-x-6 mb-8">
                <a href="mailto:achref.riahi@example.com" aria-label="Email" className="hover:text-indigo-500 transition-colors"><Mail /></a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-indigo-500 transition-colors"><Github /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-indigo-500 transition-colors"><Linkedin /></a>
            </div>
            <p className="text-sm">&copy; {year} Achref Riahi. All rights reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;
