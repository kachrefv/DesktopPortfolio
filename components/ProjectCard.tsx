
import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { ArrowRight } from 'lucide-react';
import SkillTag from './SkillTag';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-slate-200/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-lg hover:shadow-indigo-500/10 transition-shadow duration-300 backdrop-blur-sm border border-slate-300/20 dark:border-slate-700/20">
      <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">{project.name}</h3>
      <p className="text-indigo-400 dark:text-indigo-400 font-medium mb-3 text-sm">{project.tagline}</p>
      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 h-20">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.techStack.slice(0, 4).map((tech) => (
          <SkillTag key={tech} skill={tech} />
        ))}
      </div>
      <Link
        to={`/project/${project.id}`}
        className="inline-flex items-center font-semibold text-indigo-500 dark:text-indigo-400 hover:underline"
      >
        View Project <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </div>
  );
};

export default ProjectCard;
