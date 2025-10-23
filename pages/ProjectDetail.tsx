
import React from 'react';
import { useParams, Link } from 'react-router-dom';
// Fix: Module '"../data"' has no exported member 'projects'.
import { systemProjects as projects } from '../data';
import SkillTag from '../components/SkillTag';
import { ArrowLeft, ExternalLink, FileText, Github } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <Link to="/" className="text-indigo-500 hover:underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  const mainImage = project.demoGif || project.architectureDiagram || (project.screenshots && project.screenshots[0]) || 'https://placehold.co/1200x675/0f172a/a5b4fc?text=Project+Image';

  return (
    <div className="container mx-auto py-16 md:py-24 fade-in">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 mb-8 transition-colors">
            <ArrowLeft size={16}/>
            Back to all projects
        </Link>

        <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-3 text-slate-900 dark:text-slate-100">
                {project.name}
            </h1>
            <p className="text-lg text-indigo-500 dark:text-indigo-400 font-medium">
                {project.tagline}
            </p>
        </header>
        
        <img src={mainImage} alt={project.name} className="rounded-lg shadow-2xl mb-12 w-full aspect-video object-cover border border-slate-300 dark:border-slate-700"/>

        <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6 text-slate-600 dark:text-slate-300">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">About the Project</h2>
                <p>{project.longDescription}</p>
                
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 pt-4">Key Features</h3>
                <ul className="list-disc list-inside space-y-2">
                    {project.features.map((feature, index) => <li key={index}>{feature}</li>)}
                </ul>
            </div>
            <aside className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 pb-2">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                        {project.techStack.map(tech => <SkillTag key={tech} skill={tech} />)}
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 pb-2">Project Links</h3>
                    <div className="space-y-3">
                         {project.links.live && <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-indigo-500 hover:underline"><ExternalLink size={16}/> View Live Site</a>}
                         {project.links.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-indigo-500 hover:underline"><Github size={16}/> GitHub Repository</a>}
                         {project.links.docs && <a href={project.links.docs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-indigo-500 hover:underline"><FileText size={16}/> Documentation</a>}
                         {project.links.whitepaper && <a href={project.links.whitepaper} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-indigo-500 hover:underline"><FileText size={16}/> Read White Paper</a>}
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 pb-2">My Role</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{project.role}</p>
                 </div>
            </aside>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetail;