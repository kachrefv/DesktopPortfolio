import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import { ThemeContext, SettingsContext } from '../App';
import { Project } from '../types';

interface TerminalProps {
  onOpen: (id: string) => void;
  onClose: () => void;
  projects: Project[];
}

const PROMPT = (
  <span className="text-green-400">
    guest@achref.dev <span className="text-blue-400">~ $</span>
  </span>
);

const ASCII_ART = `
    _    ____  
   / \\  |  _ \\ 
  / _ \\ | |_) |
 / ___ \\|  _ < 
/_/   \\_\\_|\\_\\ 
`;

const Terminal: React.FC<TerminalProps> = ({ onOpen, onClose, projects }) => {
  const { theme, setTheme, colors } = useContext(ThemeContext);
  const settings = useContext(SettingsContext);
  const [history, setHistory] = useState<React.ReactNode[]>([
    'Welcome to my interactive portfolio terminal.',
    'Type `help` to see a list of available commands.',
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const endOfHistoryRef = useRef<HTMLDivElement>(null);

  const commands = useMemo(() => ['help', 'ls', 'cat', 'open', 'contact', 'theme', 'neofetch', 'clear', 'login', 'exit'], []);
  const projectNames = useMemo(() => projects
    .filter(p => !['terminal', 'login', 'admin-panel'].includes(p.id))
    .map(p => p.name), [projects]);

  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView();
  }, [history]);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const processCommand = (command: string): React.ReactNode => {
    const [cmd, ...args] = command.toLowerCase().split(' ').filter(Boolean);
    const arg = args.join(' ');

    switch (cmd) {
      case 'help':
        return (
          <div>
            <p className="font-bold mb-1">Available Commands:</p>
            <ul className="list-inside space-y-1">
              <li><span className="font-semibold text-green-400 w-24 inline-block">help</span> Show this help message.</li>
              <li><span className="font-semibold text-green-400 w-24 inline-block">ls</span> List all projects.</li>
              <li><span className="font-semibold text-green-400 w-24 inline-block">cat [name]</span> View project details.</li>
              <li><span className="font-semibold text-green-400 w-24 inline-block">open [name]</span> Open project window.</li>
              <li><span className="font-semibold text-green-400 w-24 inline-block">contact</span> Display contact information.</li>
              <li><span className="font-semibold text-green-400 w-24 inline-block">theme</span> Switch theme (dark/light).</li>
              <li><span className="font-semibold text-green-400 w-24 inline-block">neofetch</span> Display system information.</li>
              <li><span className="font-semibold text-green-400 w-24 inline-block">clear</span> Clear the terminal screen.</li>
              <li><span className="font-semibold text-green-400 w-24 inline-block">login</span> Open the admin login page.</li>
              <li><span className="font-semibold text-green-400 w-24 inline-block">exit</span> Close the terminal.</li>
            </ul>
          </div>
        );
      case 'ls':
        return (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {projects
              .filter(p => p.id !== 'terminal' && p.id !== 'login' && p.id !== 'admin-panel')
              .map(p => {
                const isFile = p.icon === 'FileText';
                const color = isFile ? 'text-white' : 'text-blue-400';
                return <span className={color} key={p.id}>{p.name}</span>;
              })}
          </div>
        );
      case 'cat': {
        if (!arg) return "Usage: cat [project-name]";
        const project = projects.find(p => p.name.toLowerCase() === arg.toLowerCase());
        if (!project) return `cat: ${arg}: No such project found.`;
        return (
          <div>
            <p className="font-bold text-lg" style={{color: colors[theme].accent}}>{project.name}</p>
            <p className="italic mb-2">{project.tagline}</p>
            <p className="whitespace-pre-wrap">{project.longDescription}</p>
          </div>
        );
      }
      case 'open': {
        if (!arg) return "Usage: open [project-name]";
        const project = projects.find(p => p.name.toLowerCase() === arg.toLowerCase());
        if (!project) return `open: ${arg}: No such project found.`;
        onOpen(project.id);
        return `Opening ${project.name}...`;
      }
      case 'contact':
        return (
          <div>
            <p><span className="font-semibold text-green-400 w-16 inline-block">Email:</span> {settings?.contactEmail || 'not set'}</p>
            <p><span className="font-semibold text-green-400 w-16 inline-block">GitHub:</span> {settings?.githubUrl || 'not set'}</p>
            <p><span className="font-semibold text-green-400 w-16 inline-block">LinkedIn:</span> {settings?.linkedinUrl || 'not set'}</p>
          </div>
        );
      case 'theme': {
        const newTheme = arg === 'light' ? 'light' : 'dark';
        setTheme(newTheme);
        return `Theme set to ${newTheme}.`;
      }
      case 'neofetch':
        return (
            <div className="flex gap-4">
                <pre style={{color: colors[theme].accent}}>{ASCII_ART}</pre>
                <div>
                    <p className="font-bold text-lg">{settings?.fullName || 'User'}</p>
                    <hr className="border-slate-600 my-1"/>
                    <p><span className="font-semibold text-green-400 w-20 inline-block">OS:</span> Portfolio OS</p>
                    <p><span className="font-semibold text-green-400 w-20 inline-block">Host:</span> {settings?.fullName || 'User'}'s Portfolio</p>
                    <p><span className="font-semibold text-green-400 w-20 inline-block">Shell:</span> term.js</p>
                    <p><span className="font-semibold text-green-400 w-20 inline-block">Theme:</span> {theme}</p>
                    <p><span className="font-semibold text-green-400 w-20 inline-block">Projects:</span> {projects.filter(p => !['terminal', 'login', 'admin-panel']).length}</p>
                    <p><span className="font-semibold text-green-400 w-20 inline-block">Contact:</span> {settings?.contactEmail || 'not set'}</p>
                </div>
            </div>
        )
      case 'clear':
        setHistory([]);
        return null;
      case 'login':
      case '/login':
        onOpen('login');
        return 'Opening login window...';
      case 'exit':
        onClose();
        return "Closing terminal...";
      default:
        return `command not found: ${cmd}. Type 'help' for a list of commands.`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (suggestions.length > 0) {
        setSuggestions([]);
        setSuggestionIndex(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
        e.preventDefault();

        const parts = input.split(' ');
        
        if (suggestions.length > 0) {
            const nextIndex = (suggestionIndex + 1) % suggestions.length;
            setSuggestionIndex(nextIndex);
            
            const newParts = [...parts.slice(0, -1), suggestions[nextIndex]];
            setInput(newParts.join(' '));
            return;
        }

        const currentWord = parts[parts.length - 1];
        if (currentWord === '' && !input.endsWith(' ')) return;

        let potentialCompletions: string[] = [];
        const commandParts = input.trim().split(/\s+/);
        const isCompletingCommand = commandParts.length <= 1 && commandParts[0] === currentWord;

        if (isCompletingCommand) {
            potentialCompletions = commands.filter(cmd => cmd.startsWith(currentWord));
        } else if (commandParts.length >= 1 && ['cat', 'open'].includes(commandParts[0].toLowerCase())) {
            const argToComplete = input.endsWith(' ') ? '' : commandParts[commandParts.length - 1];
            potentialCompletions = projectNames.filter(name => name.toLowerCase().startsWith(argToComplete.toLowerCase()));
        }

        if (potentialCompletions.length === 0) return;

        if (potentialCompletions.length === 1) {
            const newParts = [...parts.slice(0, -1), potentialCompletions[0]];
            setInput(newParts.join(' ') + (isCompletingCommand ? ' ' : ''));
        } else {
            setSuggestions(potentialCompletions);
            setSuggestionIndex(0);
            
            const newParts = [...parts.slice(0, -1), potentialCompletions[0]];
            setInput(newParts.join(' '));
        }
        return;

    } else if (e.key === 'Enter') {
      const command = input.trim();
      const newHistory = [...history, <>{PROMPT}&nbsp;{command}</>];

      if (command) {
        const output = processCommand(command);
        if (output) {
          newHistory.push(output);
        }
        setCommandHistory([command, ...commandHistory]);
      }

      setHistory(newHistory);
      setInput('');
      setHistoryIndex(-1);
      setSuggestions([]);
      setSuggestionIndex(0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
        setSuggestions([]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
      setSuggestions([]);
    }
  };

  return (
    <div
      className="w-full h-full bg-black/90 text-white/90 p-3 text-sm terminal leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="overflow-y-auto h-full">
        {history.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        <div className="flex">
          {PROMPT}&nbsp;
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none flex-grow focus:outline-none text-white terminal-input"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
        <div ref={endOfHistoryRef} />
      </div>
    </div>
  );
};

export default Terminal;