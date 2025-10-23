import React, { useContext } from 'react';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import SkillTag from './SkillTag';
import { SettingsContext } from '../App';

const StartMenu = ({ onOpen, onClose }) => {
    const settings = useContext(SettingsContext);
    const skills = settings?.skills || [];

    const handleOpenReadme = () => {
        onOpen('about-me');
        onClose();
    };

    return (
        <div 
            className="absolute bottom-full right-0 mb-2 md:bottom-full md:top-auto md:left-0 md:right-auto md:mb-2 w-96 bg-slate-200/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg shadow-2xl border border-slate-300/50 dark:border-slate-700/50 overflow-hidden fade-in"
            style={{ animationDuration: '150ms' }}
        >
            <div className="p-4">
                <div className="flex items-center gap-4 mb-4">
                    <img src={`https://placehold.co/64x64/0f172a/a5b4fc?text=${settings?.fullName?.charAt(0) || 'A'}`} alt={settings?.fullName || 'User'} className="w-16 h-16 rounded-full border-2 border-slate-400 dark:border-slate-600" />
                    <div>
                        <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">{settings?.fullName || 'Your Name'}</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{settings?.tagline || 'Your Title'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                     <button onClick={handleOpenReadme} className="p-3 text-left rounded-md hover:bg-slate-300/50 dark:hover:bg-slate-700/50">
                        <h3 className="font-semibold">About Me</h3>
                        <p className="text-xs text-slate-500">Read my README file.</p>
                    </button>
                    <a href={settings?.cvUrl || '#'} target="_blank" rel="noopener noreferrer" className="p-3 text-left rounded-md hover:bg-slate-300/50 dark:hover:bg-slate-700/50">
                        <h3 className="font-semibold flex items-center gap-2"><Download size={14}/> Download CV</h3>
                        <p className="text-xs text-slate-500">Get the full resume.</p>
                    </a>
                </div>

                <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2 px-2">Key Skills</h3>
                <div className="flex flex-wrap gap-2 px-2 mb-4">
                    {skills.map(skill => <SkillTag key={skill} skill={skill} />)}
                </div>

            </div>
            <footer className="bg-slate-300/50 dark:bg-slate-900/50 px-4 py-3 flex justify-end items-center gap-4">
                <a href={`mailto:${settings?.contactEmail || ''}`} aria-label="Email" className="text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors"><Mail size={20}/></a>
                <a href={settings?.githubUrl || '#'} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors"><Github size={20}/></a>
                <a href={settings?.linkedinUrl || '#'} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors"><Linkedin size={20}/></a>
            </footer>
        </div>
    );
};

export default StartMenu;