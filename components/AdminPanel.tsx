import React, { useState, useEffect, useContext } from 'react';
import { Project, ThemeColors } from '../types';
import { ThemeContext, SettingsContext } from '../App';
import { auth } from '../firebase';
import { Save, X, Plus, RotateCcw, LogOut, Settings, FolderKanban, Palette } from 'lucide-react';

// --- SHARED COMPONENTS ---

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-secondary mb-1">{label}</label>
    <input
      type="text"
      {...props}
      className="block w-full rounded-md border-0 bg-slate-200 dark:bg-slate-700/50 p-2 text-primary placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

const TextAreaField = ({ label, ...props }) => (
  <div className="mt-4">
    <label className="block text-xs font-medium text-secondary mb-1">{label}</label>
    <textarea
      {...props}
      className="block w-full rounded-md border-0 bg-slate-200 dark:bg-slate-700/50 p-2 text-primary placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      rows={props.rows || 4}
    />
  </div>
);

interface ColorFieldProps {
    label: string; name: string; value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ColorField: React.FC<ColorFieldProps> = ({ label, name, value, onChange }) => (
    <div className="flex items-center justify-between">
        <label htmlFor={name} className="text-xs text-secondary">{label}</label>
        <div className="flex items-center gap-2 border border-slate-300 dark:border-slate-600 rounded-md px-2">
             <span className="text-sm font-mono text-secondary">{value}</span>
             <input
                type="color" id={name} name={name} value={value} onChange={onChange}
                className="w-6 h-6 bg-transparent border-none"
             />
        </div>
    </div>
);

// --- THEME EDITOR VIEW ---

const ThemeEditor = () => {
    const { colors, updateColors, resetColors } = useContext(ThemeContext);

    const handleColorChange = (theme: 'light' | 'dark', field: keyof ThemeColors, value: string) => {
        const newColors = JSON.parse(JSON.stringify(colors));
        newColors[theme][field] = value;
        updateColors(newColors);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-primary">Theme Color Editor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-3 p-4 rounded-lg bg-slate-200 dark:bg-slate-900/50">
                    <h3 className="font-semibold text-primary">Light Theme</h3>
                    {Object.entries(colors.light).map(([key, value]) => (
                        <ColorField 
                            key={`light-${key}`}
                            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            name={`light-${key}`}
                            value={value as string}
                            onChange={(e) => handleColorChange('light', key as keyof ThemeColors, e.target.value)}
                        />
                    ))}
                </div>
                 <div className="space-y-3 p-4 rounded-lg bg-slate-200 dark:bg-slate-900/50">
                    <h3 className="font-semibold text-primary">Dark Theme</h3>
                    {Object.entries(colors.dark).map(([key, value]) => (
                        <ColorField 
                            key={`dark-${key}`}
                            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            name={`dark-${key}`}
                            value={value as string}
                            onChange={(e) => handleColorChange('dark', key as keyof ThemeColors, e.target.value)}
                        />
                    ))}
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                 <button type="button" onClick={resetColors} className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-500 hover:bg-slate-600 text-white font-semibold text-xs">
                    <RotateCcw size={14}/> Reset All Colors to Default
                </button>
            </div>
        </div>
    );
};


// --- PORTFOLIO SETTINGS VIEW ---
// Fix: Add an interface for the settings form data to resolve type errors.
interface PortfolioSettingsData {
    portfolioName?: string;
    fullName?: string;
    tagline?: string;
    contactEmail?: string;
    cvUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    skills?: string;
    wallpaperUrl?: string;
}

const PortfolioSettings = ({ onUpdateSettings }) => {
    const settings = useContext(SettingsContext);
    const [formData, setFormData] = useState<PortfolioSettingsData>({});

    useEffect(() => {
        if (settings) {
            const skillsString = Array.isArray(settings.skills) ? settings.skills.join(', ') : '';
            setFormData({ ...settings, skills: skillsString });
        }
    }, [settings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateSettings(formData);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4 text-primary">Portfolio Settings</h2>
            <div className="space-y-4">
                <h3 className="font-bold mt-2 mb-2 text-base text-primary border-b border-slate-300 dark:border-slate-700 pb-1">General</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Portfolio Name" name="portfolioName" value={formData.portfolioName || ''} onChange={handleInputChange} />
                    <InputField label="Full Name" name="fullName" value={formData.fullName || ''} onChange={handleInputChange} />
                </div>
                <InputField label="Tagline" name="tagline" value={formData.tagline || ''} onChange={handleInputChange} />
                <InputField label="Desktop Wallpaper URL" name="wallpaperUrl" value={formData.wallpaperUrl || ''} onChange={handleInputChange} placeholder="https://..." />
                
                <h3 className="font-bold mt-6 mb-2 text-base text-primary border-b border-slate-300 dark:border-slate-700 pb-1">Contact & Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Contact Email" name="contactEmail" value={formData.contactEmail || ''} onChange={handleInputChange} />
                    <InputField label="CV Download URL" name="cvUrl" value={formData.cvUrl || ''} onChange={handleInputChange} />
                    <InputField label="GitHub URL" name="githubUrl" value={formData.githubUrl || ''} onChange={handleInputChange} />
                    <InputField label="LinkedIn URL" name="linkedinUrl" value={formData.linkedinUrl || ''} onChange={handleInputChange} />
                </div>
                
                <h3 className="font-bold mt-6 mb-2 text-base text-primary border-b border-slate-300 dark:border-slate-700 pb-1">Skills</h3>
                <TextAreaField label="Key Skills (comma-separated)" name="skills" value={formData.skills || ''} onChange={handleInputChange} rows={3} />
            </div>

            <div className="mt-8 flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent hover:bg-accent-darker text-white font-semibold">
                    <Save size={16} /> Save Settings
                </button>
            </div>
        </form>
    );
};


// --- PROJECT EDITOR VIEW ---

const ProjectEditor = ({ projects, onUpdateProject, onCreateProject }) => {
  const editableProjects = projects.filter(p => !['terminal', 'login', 'admin-panel'].includes(p.id));
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(editableProjects[0]?.id || null);
  const [formData, setFormData] = useState<Partial<Project>>({});

  const newProjectTemplate: Project = {
    id: '', name: '', tagline: '', role: '', techStack: [], description: '',
    longDescription: '', features: [], screenshots: [], demoGif: '',
    architectureDiagram: '', links: { live: '', github: '', docs: '', whitepaper: '' }, icon: 'Folder',
  };

  useEffect(() => {
    if (selectedProjectId === 'new') {
      setFormData(JSON.parse(JSON.stringify(newProjectTemplate)));
    } else if (selectedProjectId) {
      setFormData(JSON.parse(JSON.stringify(projects.find(p => p.id === selectedProjectId) || {})));
    } else {
      setFormData({});
    }
  }, [selectedProjectId, projects]);

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('links.')) {
      const linkName = name.split('.')[1];
      setFormData(prev => ({ ...prev, links: { ...prev.links, [linkName]: value } }));
    } else if (name === 'name' && selectedProjectId === 'new') {
       setFormData(prev => ({ ...prev, name: value, id: slugify(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: 'techStack' | 'features' | 'screenshots') => {
    setFormData(prev => ({ ...prev, [field]: e.target.value.split(',').map(item => item.trim()).filter(Boolean) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name) return alert('Project ID and Name are required.');

    if (selectedProjectId === 'new') {
      if (projects.some(p => p.id === formData.id)) return alert('A project with this ID already exists.');
      onCreateProject(formData as Project);
      setSelectedProjectId(formData.id);
      alert('Project created!');
    } else {
      onUpdateProject(formData as Project);
      alert('Project saved!');
    }
  };

  const handleCancel = () => {
    if (selectedProjectId === 'new') {
        setSelectedProjectId(editableProjects[0]?.id || null);
    } else {
        setFormData(JSON.parse(JSON.stringify(projects.find(p => p.id === selectedProjectId) || {})));
    }
  };

  const currentProjectForDisplay = selectedProjectId === 'new' ? formData : projects.find(p => p.id === selectedProjectId);

  return (
    <div className="flex h-full">
      <aside className="w-1/3 max-w-xs bg-slate-200/50 dark:bg-slate-900/30 p-2 border-r border-slate-300 dark:border-slate-700 overflow-y-auto flex flex-col">
        <h2 className="font-bold p-2 text-base text-primary">Projects</h2>
        <ul className="flex-grow">
          {editableProjects.map(p => (
            <li key={p.id}>
              <button
                onClick={() => setSelectedProjectId(p.id)}
                className={`w-full text-left p-2 rounded-md transition-colors text-primary ${selectedProjectId === p.id ? 'bg-accent text-white' : 'hover:bg-slate-300 dark:hover:bg-slate-700'}`}
              >
                {p.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="p-2 mt-2 border-t border-slate-300 dark:border-slate-700">
             <button
                onClick={() => setSelectedProjectId('new')}
                className="w-full flex items-center justify-center gap-2 p-2 rounded-md transition-colors bg-accent text-white hover:bg-accent-darker"
              >
                <Plus size={16} /> New Project
              </button>
        </div>
      </aside>
      <main className="flex-grow p-4 md:p-6 overflow-y-auto">
        {currentProjectForDisplay ? (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4 text-primary">{selectedProjectId === 'new' ? 'Create New Project' : `Editing: ${currentProjectForDisplay.name}`}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputField label="Name" name="name" value={formData.name || ''} onChange={handleInputChange} />
              <InputField label="ID" name="id" value={formData.id || ''} onChange={handleInputChange} disabled={selectedProjectId !== 'new' && currentProjectForDisplay.id === 'about-me'} />
              <InputField label="Tagline" name="tagline" value={formData.tagline || ''} onChange={handleInputChange} />
              <InputField label="Role" name="role" value={formData.role || ''} onChange={handleInputChange} />
            </div>
            <TextAreaField label="Description" name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} />
            <TextAreaField label="Long Description" name="longDescription" value={formData.longDescription || ''} onChange={handleInputChange} rows={6} />
            <TextAreaField label="Tech Stack (comma-separated)" name="techStack" value={(formData.techStack || []).join(', ')} onChange={(e) => handleArrayChange(e, 'techStack')} />
            <TextAreaField label="Features (comma-separated)" name="features" value={(formData.features || []).join(', ')} onChange={(e) => handleArrayChange(e, 'features')} />
            <h3 className="font-bold mt-6 mb-2 text-base text-primary">Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputField label="Demo GIF URL" name="demoGif" value={formData.demoGif || ''} onChange={handleInputChange} />
              <InputField label="Architecture Diagram URL" name="architectureDiagram" value={formData.architectureDiagram || ''} onChange={handleInputChange} />
            </div>
            <TextAreaField label="Screenshots (comma-separated URLs)" name="screenshots" value={(formData.screenshots || []).join(', ')} onChange={(e) => handleArrayChange(e, 'screenshots')} />
            <h3 className="font-bold mt-6 mb-2 text-base text-primary">Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Live URL" name="links.live" value={formData.links?.live || ''} onChange={handleInputChange} />
              <InputField label="GitHub URL" name="links.github" value={formData.links?.github || ''} onChange={handleInputChange} />
              <InputField label="Docs URL" name="links.docs" value={formData.links?.docs || ''} onChange={handleInputChange} />
              <InputField label="Whitepaper URL" name="links.whitepaper" value={formData.links?.whitepaper || ''} onChange={handleInputChange} />
            </div>
            <div className="mt-8 flex justify-end gap-4">
               <button type="button" onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-500 hover:bg-slate-600 text-white font-semibold">
                <X size={16}/> Cancel
              </button>
              <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent hover:bg-accent-darker text-white font-semibold">
                <Save size={16} /> {selectedProjectId === 'new' ? 'Create Project' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : <p className="text-secondary text-center mt-8">Select a project to edit or create a new one.</p>}
      </main>
    </div>
  );
};


// --- MAIN ADMIN PANEL CONTAINER ---

interface AdminPanelProps {
  projects: Project[];
  onUpdateProject: (project: Project) => void;
  onCreateProject: (project: Project) => void;
  onUpdateSettings: (settings: any) => void;
}

const NavItem = ({ label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-2 rounded-md text-left font-semibold transition-colors ${
            isActive ? 'bg-accent text-white' : 'text-primary hover:bg-slate-300 dark:hover:bg-slate-700/50'
        }`}
    >
        <Icon size={18} />
        <span>{label}</span>
    </button>
);

const AdminPanel: React.FC<AdminPanelProps> = ({ projects, onUpdateProject, onCreateProject, onUpdateSettings }) => {
  const [activeView, setActiveView] = useState('projects');

  const handleLogout = async () => {
    await auth.signOut();
  };
  
  const renderActiveView = () => {
      switch(activeView) {
          case 'projects':
              return <ProjectEditor projects={projects} onUpdateProject={onUpdateProject} onCreateProject={onCreateProject} />;
          case 'settings':
              return <PortfolioSettings onUpdateSettings={onUpdateSettings} />;
          case 'theme':
              return <ThemeEditor />;
          default:
              return null;
      }
  };

  return (
    <div className="flex h-full text-sm">
      <aside className="w-1/3 max-w-56 bg-slate-200 dark:bg-slate-900/50 p-2 border-r border-slate-300 dark:border-slate-700 flex flex-col">
        <nav className="flex-grow space-y-1">
            <NavItem label="Projects" icon={FolderKanban} isActive={activeView==='projects'} onClick={() => setActiveView('projects')} />
            <NavItem label="Portfolio Settings" icon={Settings} isActive={activeView==='settings'} onClick={() => setActiveView('settings')} />
            <NavItem label="Theme Editor" icon={Palette} isActive={activeView==='theme'} onClick={() => setActiveView('theme')} />
        </nav>
        <div className="p-1 border-t border-slate-300 dark:border-slate-700">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-2 rounded-md transition-colors bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-semibold">
                <LogOut size={16} /> Log Out
            </button>
        </div>
      </aside>
      <main className="flex-grow overflow-y-auto">
        <div className={`${activeView !== 'projects' ? 'p-4 md:p-6' : ''}`}>
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;