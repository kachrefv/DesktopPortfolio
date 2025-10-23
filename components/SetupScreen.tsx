import React, { useState } from 'react';
import { Lock, User, Key, Edit3, Shield, Loader2, Info, Link, Palette, ChevronLeft } from 'lucide-react';
import { auth, settingsCollection, projectsCollection } from '../firebase';
import { AppTheme, ThemeColors } from '../types';

interface SetupScreenProps {
  onSetupComplete: () => void;
}

const defaultColors: AppTheme = {
  dark: {
    bg1: '#0f172a', bg2: '#334155', accent: '#6366f1', windowBg: '#1e293b',
    windowHeader: '#020617', textPrimary: '#e2e8f0', textSecondary: '#94a3b8',
  },
  light: {
    bg1: '#e0e7ff', bg2: '#a5b4fc', accent: '#4f46e5', windowBg: '#f8fafc',
    windowHeader: '#e2e8f0', textPrimary: '#0f172a', textSecondary: '#475569',
  },
};

const ProgressBar = ({ step, totalSteps }) => (
    <div className="flex justify-between items-center mb-8">
        {[...Array(totalSteps)].map((_, i) => (
            <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${step > i ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                        {i + 1}
                    </div>
                </div>
                {i < totalSteps - 1 && <div className={`flex-grow h-1 transition-colors ${step > i + 1 ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>}
            </React.Fragment>
        ))}
    </div>
);

const SetupScreen: React.FC<SetupScreenProps> = ({ onSetupComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    portfolioName: 'My Interactive Portfolio',
    email: '',
    password: '',
    fullName: 'Achref Riahi',
    tagline: 'Full-Stack Developer & System Architect',
    aboutMe: "I’m a full-stack developer passionate about creating systems that connect AI, blockchain, and human creativity. My focus is designing functional architectures that solve real problems — from decentralized payments to AI-powered app generation.\n\nMy journey has taken me from traditional development to architecting integrated ecosystems. I follow a personal methodology I call \"Cognitive Monoflux\" to streamline complex system design, ensuring scalability and robustness from the ground up.",
    skills: "Full-Stack, System Architecture, AI Integration, Blockchain Design, Next.js, Laravel",
    aboutMeFeatures: "Deep expertise in full-stack development and system architecture., Proven ability to integrate complex technologies like AI and blockchain., A methodical, design-first approach to building scalable systems., Passion for solving real-world problems with creative solutions.",
    contactEmail: 'achref.riahi@example.com',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    cvUrl: '',
    wallpaperUrl: '',
    colors: defaultColors,
  });
  const [createAboutMe, setCreateAboutMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (theme: 'light' | 'dark', field: keyof ThemeColors, value: string) => {
    const newColors = JSON.parse(JSON.stringify(formData.colors));
    newColors[theme][field] = value;
    setFormData(prev => ({...prev, colors: newColors}));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password.length < 6) {
        setError("Password should be at least 6 characters long.");
        setIsLoading(false);
        return;
    }

    try {
      await auth.createUserWithEmailAndPassword(formData.email, formData.password);
      nextStep();
    } catch (err: any) {
      setError(err.message || 'An error occurred creating the admin user.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const { email, password, aboutMe, skills, aboutMeFeatures, ...settingsData } = formData;
        
        const skillsArray = skills.split(',').map(item => item.trim()).filter(Boolean);

        // Save portfolio settings
        await settingsCollection.doc('app').set({
            ...settingsData,
            skills: skillsArray,
            setupComplete: true,
        });

        if (createAboutMe) {
          // Create the about-me project
          await projectsCollection.doc('about-me').set({
              id: 'about-me',
              name: 'README.md',
              icon: 'FileText',
              tagline: formData.tagline,
              role: 'Author',
              techStack: skillsArray,
              description: 'A little bit about me, my passion, and my methodology.',
              longDescription: formData.aboutMe,
              features: formData.aboutMeFeatures.split(',').map(item => item.trim()).filter(Boolean),
              links: {},
          });
        }

        onSetupComplete();
    } catch (err: any) {
        setError(err.message || 'An error occurred during final setup.');
    } finally {
        setIsLoading(false);
    }
  }

  const renderStep = () => {
    switch(step) {
        case 1:
            return (
                <form onSubmit={handleAdminSubmit} className="space-y-6">
                    <InputField label="Portfolio Name" name="portfolioName" value={formData.portfolioName} onChange={handleChange} icon={Edit3} placeholder="My Awesome Portfolio" />
                    <InputField label="Admin Email" name="email" type="email" value={formData.email} onChange={handleChange} icon={User} placeholder="admin@example.com" />
                    <InputField label="Admin Password" name="password" type="password" value={formData.password} onChange={handleChange} icon={Key} placeholder="••••••••" />
                    <button type="submit" disabled={isLoading} className="w-full btn-primary">
                        {isLoading ? <><Loader2 className="h-5 w-5 animate-spin"/>Creating Account...</> : 'Create Account & Continue'}
                    </button>
                </form>
            );
        case 2:
             return (
                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                    <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} icon={User} placeholder="Your Name" />
                    <InputField label="Title / Tagline" name="tagline" value={formData.tagline} onChange={handleChange} icon={Edit3} placeholder="e.g. Full-Stack Developer" />
                    <TextAreaField label="Key Skills (for Start Menu & About Page, comma-separated)" name="skills" value={formData.skills} onChange={handleChange} rows={2} placeholder="React, TypeScript,..." />
                    
                    <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
                        <input type="checkbox" id="createAboutMe" checked={createAboutMe} onChange={(e) => setCreateAboutMe(e.target.checked)} className="h-4 w-4 rounded border-slate-500 text-indigo-600 focus:ring-indigo-600" />
                        <label htmlFor="createAboutMe" className="text-sm font-medium text-slate-300">Create 'About Me' (README.md) page</label>
                    </div>

                    {createAboutMe && (
                        <div className="space-y-4 pl-6">
                            <TextAreaField label="About Me (README.md content)" name="aboutMe" value={formData.aboutMe} onChange={handleChange} rows={5} placeholder="Tell us a bit about yourself..." />
                            <TextAreaField label="Highlights / Features (for README, comma-separated)" name="aboutMeFeatures" value={formData.aboutMeFeatures} onChange={handleChange} rows={3} placeholder="Feature 1, Feature 2,..." />
                        </div>
                    )}

                    <div className="flex justify-between">
                        <button type="button" onClick={prevStep} className="btn-secondary"><ChevronLeft size={16}/> Back</button>
                        <button type="submit" className="btn-primary">Continue</button>
                    </div>
                </form>
            );
        case 3:
            return (
                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                    <InputField label="Contact Email" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} icon={User} placeholder="contact@example.com" />
                    <InputField label="GitHub URL" name="githubUrl" value={formData.githubUrl} onChange={handleChange} icon={Link} placeholder="https://github.com/..." />
                    <InputField label="LinkedIn URL" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} icon={Link} placeholder="https://linkedin.com/in/..." />
                    <InputField label="CV Download URL (Optional)" name="cvUrl" value={formData.cvUrl} onChange={handleChange} icon={Link} placeholder="Link to your resume PDF" required={false}/>
                    <InputField label="Desktop Wallpaper URL (Optional)" name="wallpaperUrl" value={formData.wallpaperUrl} onChange={handleChange} icon={Link} placeholder="https://..." required={false} />
                    <div className="flex justify-between">
                        <button type="button" onClick={prevStep} className="btn-secondary"><ChevronLeft size={16}/> Back</button>
                        <button type="submit" className="btn-primary">Continue to Theming</button>
                    </div>
                </form>
            );
        case 4:
            return (
                <form onSubmit={handleFinalSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ThemeColorEditor theme="light" colors={formData.colors.light} onChange={handleColorChange} />
                        <ThemeColorEditor theme="dark" colors={formData.colors.dark} onChange={handleColorChange} />
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={prevStep} className="btn-secondary"><ChevronLeft size={16}/> Back</button>
                        <button type="submit" disabled={isLoading} className="btn-primary">
                            {isLoading ? <><Loader2 className="h-5 w-5 animate-spin"/>Saving...</> : 'Complete Setup'}
                        </button>
                    </div>
                </form>
            );
        default: return null;
    }
  }

  const stepTitles = [
      { title: "Admin Account", icon: Lock, subtitle: "Create your admin account to manage the portfolio." },
      { title: "Personal Info", icon: Info, subtitle: "Tell visitors who you are." },
      { title: "Contact & Links", icon: Link, subtitle: "Provide your contact and social media links." },
      { title: "Theme Colors", icon: Palette, subtitle: "Customize the look and feel of your portfolio." }
  ];
  const currentStepInfo = stepTitles[step - 1];

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 p-4">
      <div className="gradient-bg fixed inset-0 -z-10"></div>
      <div className="w-full max-w-2xl p-8 bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-2xl border border-slate-700/50 fade-in">
        <ProgressBar step={step} totalSteps={4} />
        <div className="text-center mb-8">
            <div className="inline-block p-3 bg-indigo-500/20 rounded-full mb-3">
                <currentStepInfo.icon className="h-8 w-8 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">{currentStepInfo.title}</h1>
            <p className="text-md text-slate-400 mt-1">{currentStepInfo.subtitle}</p>
        </div>

        {error && (
            <div className="flex items-center text-sm text-red-400 bg-red-500/20 p-3 rounded-md mb-6">
              <Shield className="h-5 w-5 mr-3 flex-shrink-0" />
              <p>{error}</p>
            </div>
        )}
        {renderStep()}
      </div>
    </div>
  );
};

const InputField = ({ label, icon: Icon, required = true, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <div className="relative">
            {Icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Icon className="h-5 w-5 text-slate-400" /></div>}
            <input {...props} id={props.name} required={required} className="block w-full rounded-md border-0 bg-slate-700/50 pl-10 pr-3 py-2.5 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500" />
        </div>
    </div>
);
const TextAreaField = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea {...props} id={props.name} required className="block w-full rounded-md border-0 bg-slate-700/50 p-3 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500" />
    </div>
);

// Fix: Add explicit types for ColorField props and type as React.FC to allow 'key' prop in loops.
interface ColorFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ColorField: React.FC<ColorFieldProps> = ({ label, name, value, onChange }) => (
    <div className="flex items-center justify-between">
        <label htmlFor={name} className="text-sm text-slate-300">{label}</label>
        <div className="flex items-center gap-2 border border-slate-600 rounded-md px-2 bg-slate-700/50">
             <span className="text-sm font-mono text-slate-400">{value}</span>
             <input type="color" id={name} name={name} value={value} onChange={onChange} className="w-6 h-6 bg-transparent border-none cursor-pointer" />
        </div>
    </div>
);

const ThemeColorEditor = ({ theme, colors, onChange }) => (
    <div className="space-y-3 p-4 rounded-lg bg-slate-900/50">
        <h3 className="font-semibold text-lg text-center capitalize">{theme} Theme</h3>
        {Object.entries(colors).map(([key, value]) => (
            <ColorField 
                key={`${theme}-${key}`}
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                name={`${theme}-${key}`}
                value={value as string}
                onChange={(e) => onChange(theme, key as keyof ThemeColors, e.target.value)}
            />
        ))}
    </div>
);

export default SetupScreen;