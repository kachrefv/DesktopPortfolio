import React, { useState } from 'react';
import { Project } from '../types';
import SkillTag from './SkillTag';
import { ExternalLink, FileText, Github, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectContentProps {
  project: Project;
}

const ProjectContent: React.FC<ProjectContentProps> = ({ project }) => {
  const visuals = [
    ...(project.demoGif ? [project.demoGif] : []),
    ...(project.architectureDiagram ? [project.architectureDiagram] : []),
    ...(project.screenshots || []),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? visuals.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === visuals.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="p-6 text-sm project-content-animation">
        <header className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold tracking-tighter mb-2 text-primary">
                {project.name}
            </h1>
            <p className="text-accent font-medium">
                {project.tagline}
            </p>
        </header>
        
        {visuals.length > 0 && (
            <div className="relative group mb-8 w-full aspect-video">
                <div className="w-full h-full rounded-lg shadow-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                    <div 
                        className="w-full h-full flex transition-transform ease-out duration-300"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {visuals.map((src, index) => (
                            <img key={index} src={src} alt={`${project.name} screenshot ${index + 1}`} className="w-full h-full object-cover flex-shrink-0" loading="lazy" />
                        ))}
                    </div>
                </div>

                {visuals.length > 1 && (
                <>
                    <button 
                        onClick={goToPrevious} 
                        aria-label="Previous image"
                        className="absolute top-1/2 -translate-y-1/2 left-3 bg-black/40 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                        onClick={goToNext} 
                        aria-label="Next image"
                        className="absolute top-1/2 -translate-y-1/2 right-3 bg-black/40 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
                    >
                        <ChevronRight size={20} />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {visuals.map((_, index) => (
                            <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${currentIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
                            aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
                )}
            </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4 text-secondary">
                <h2 className="text-lg font-bold text-primary">About the Project</h2>
                <p className="whitespace-pre-wrap">{project.longDescription}</p>
                
                <h3 className="text-lg font-bold text-primary pt-2">Key Features</h3>
                <ul className="list-disc list-inside space-y-1.5">
                    {project.features.map((feature, index) => <li key={index}>{feature}</li>)}
                </ul>
            </div>
            <aside className="space-y-6">
                 <div>
                    <h3 className="text-base font-semibold mb-3 text-primary border-b border-slate-300 dark:border-slate-700 pb-2">My Role</h3>
                    <p className="text-sm text-secondary">{project.role}</p>
                 </div>
                <div>
                    <h3 className="text-base font-semibold mb-3 text-primary border-b border-slate-300 dark:border-slate-700 pb-2">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                        {project.techStack.map(tech => <SkillTag key={tech} skill={tech} />)}
                    </div>
                </div>
                 {Object.keys(project.links).length > 0 && <div>
                    <h3 className="text-base font-semibold mb-3 text-primary border-b border-slate-300 dark:border-slate-700 pb-2">Project Links</h3>
                    <div className="space-y-3">
                         {project.links.live && <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-accent hover:underline"><ExternalLink size={16}/> View Live Site</a>}
                         {project.links.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-accent hover:underline"><Github size={16}/> GitHub Repository</a>}
                         {project.links.docs && <a href={project.links.docs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-accent hover:underline"><FileText size={16}/> Documentation</a>}
                         {project.links.whitepaper && <a href={project.links.whitepaper} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-accent hover:underline"><FileText size={16}/> Read White Paper</a>}
                    </div>
                </div>}
            </aside>
        </div>
    </div>
  );
};

export default ProjectContent;