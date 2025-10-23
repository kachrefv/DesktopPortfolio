
import React from 'react';
// Fix: Module '"../data"' has no exported member 'projects'.
import { systemProjects as projects } from '../data';
import ProjectCard from '../components/ProjectCard';
import SkillTag from '../components/SkillTag';
import { Download, Eye } from 'lucide-react';

const Home = () => {
  const skills = ['Laravel', 'Next.js', 'PostgreSQL', 'Tailwind CSS', 'AI Integration', 'Blockchain Design', 'System Architecture'];

  return (
    <div className="container mx-auto py-16 md:py-24 space-y-24 md:space-y-32">
      {/* Hero Section */}
      <section className="text-center fade-in">
        <img src="https://placehold.co/128x128/0f172a/a5b4fc?text=AR" alt="Achref Riahi" className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mb-6 border-4 border-slate-300 dark:border-slate-700 shadow-lg" />
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 text-slate-900 dark:text-slate-100">
          Achref Riahi
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-indigo-500 dark:text-indigo-400 mb-6">
          Full-Stack Developer & System Architect
        </p>
        <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300 mb-8">
          Building intelligent systems that merge AI, fintech, and creative design.
        </p>
        <div className="flex justify-center space-x-4">
          <a href="#projects" className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors shadow-lg">
            View Projects
          </a>
           <a href="#" className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold px-6 py-3 rounded-md hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
            <Download size={18}/> Download CV
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-slate-100">About Me</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="text-slate-600 dark:text-slate-300 space-y-4 text-center md:text-left">
                <p>
                    I’m a full-stack developer passionate about creating systems that connect AI, blockchain, and human creativity. My focus is designing functional architectures that solve real problems — from decentralized payments to AI-powered app generation.
                </p>
                <p>
                    My journey has taken me from traditional development to architecting integrated ecosystems. I follow a personal methodology I call "Cognitive Monoflux" to streamline complex system design, ensuring scalability and robustness from the ground up.
                </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
                <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Key Skills</h3>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {skills.map(skill => <SkillTag key={skill} skill={skill} />)}
                </div>
            </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="fade-in" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-slate-100">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;