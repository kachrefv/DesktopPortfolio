import React, { useState, useEffect, createContext, useMemo, useCallback, useRef } from 'react';
import { systemProjects } from './data';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import ProjectContent from './components/ProjectContent';
import Terminal from './components/Terminal';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import { Project, AppTheme } from './types';
import { auth, projectsCollection, settingsCollection } from './firebase';
import SetupScreen from './components/SetupScreen';

const defaultColors: AppTheme = {
  dark: {
    bg1: '#0f172a',
    bg2: '#334155',
    accent: '#6366f1',
    windowBg: '#1e293b',
    windowHeader: '#020617',
    textPrimary: '#e2e8f0',
    textSecondary: '#94a3b8',
  },
  light: {
    bg1: '#e0e7ff',
    bg2: '#a5b4fc',
    accent: '#4f46e5',
    windowBg: '#f8fafc',
    windowHeader: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
  },
};

const hexToRgb = (hex: string): string => {
  if (!hex) return '0, 0, 0';
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : '0, 0, 0';
};


export const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: (theme: 'dark' | 'light') => {},
  colors: defaultColors,
  updateColors: async (newColors: AppTheme) => {},
  resetColors: async () => {},
});

export const SettingsContext = createContext(null);

const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

export default function App() {
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [settings, setSettings] = useState(null);
  
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (userPrefersDark ? 'dark' : 'light');
  });

  const [colors, setColors] = useState<AppTheme>(defaultColors);

  const [projects, setProjects] = useState<Project[]>(systemProjects);
  const [windows, setWindows] = useState([]);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [activeWindow, setActiveWindow] = useState(null);
  const [snapPreview, setSnapPreview] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const activeActionRef = useRef(null);

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const appSettingsDoc = await settingsCollection.doc('app').get();
        if (appSettingsDoc.exists && appSettingsDoc.data()?.setupComplete) {
          setNeedsSetup(false);
        } else {
          setNeedsSetup(true);
        }
      } catch (error) {
        console.error("Error checking setup status:", error);
        setNeedsSetup(true); // Fallback to setup on error
      } finally {
        setIsCheckingSetup(false);
      }
    };

    checkSetupStatus();
  }, []);

  useEffect(() => {
    if (isCheckingSetup || needsSetup) return;

    // Load app-wide settings
    const loadAppSettings = async () => {
        try {
            const appSettingsDoc = await settingsCollection.doc('app').get();
            if (appSettingsDoc.exists) {
                const appSettings = appSettingsDoc.data();
                setSettings(appSettings);
                if (appSettings.colors) {
                    setColors(appSettings.colors);
                    localStorage.setItem('app-colors', JSON.stringify(appSettings.colors));
                }
                if (appSettings.portfolioName) {
                    document.title = appSettings.portfolioName;
                }
            }
        } catch (error) {
            console.error("Error loading app settings:", error);
        }
    };
    loadAppSettings();

    // Firebase Auth listener
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
      if (!user) {
        closeWindow('admin-panel');
      }
    });
    
    // Firestore Projects listener
    const unsubscribeProjects = projectsCollection.onSnapshot(snapshot => {
      const firestoreProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isFirestore: true } as Project));
      const firestoreProjectIds = new Set(firestoreProjects.map(p => p.id));
      const uniqueSystemProjects = systemProjects.filter(p => !firestoreProjectIds.has(p.id));
      setProjects([...uniqueSystemProjects, ...firestoreProjects]);
    }, error => {
      console.error("Error fetching projects from Firestore: ", error);
    });

    return () => {
        unsubscribeAuth();
        unsubscribeProjects();
    };
  }, [isCheckingSetup, needsSetup]);


  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const currentColors = colors[theme];

    if (!currentColors) return;

    root.style.setProperty('--color-bg1', currentColors.bg1);
    root.style.setProperty('--color-bg2', currentColors.bg2);
    root.style.setProperty('--color-accent', currentColors.accent);
    root.style.setProperty('--color-accent-rgb', hexToRgb(currentColors.accent));
    root.style.setProperty('--color-window-bg', currentColors.windowBg);
    root.style.setProperty('--color-window-bg-rgb', hexToRgb(currentColors.windowBg));
    root.style.setProperty('--color-window-header', currentColors.windowHeader);
    root.style.setProperty('--color-window-header-rgb', hexToRgb(currentColors.windowHeader));
    root.style.setProperty('--color-text-primary', currentColors.textPrimary);
    root.style.setProperty('--color-text-secondary', currentColors.textSecondary);
    
    const windowBorderRgb = theme === 'dark' ? '71, 85, 105' : '203, 213, 225';
    root.style.setProperty('--color-window-border-rgb', windowBorderRgb);
    
    const desktopIconTextColor = theme === 'dark' ? '#FFFFFF' : '#1e293b';
    root.style.setProperty('--color-desktop-icon-text', desktopIconTextColor);
    root.style.setProperty('--color-desktop-icon-text-rgb', hexToRgb(desktopIconTextColor));

  }, [colors, theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const updateColors = async (newColors: AppTheme) => {
    setColors(newColors);
    localStorage.setItem('app-colors', JSON.stringify(newColors));
    try {
        await settingsCollection.doc('app').set({ colors: newColors }, { merge: true });
    } catch(e) {
        console.error("Failed to save colors to Firestore", e);
    }
  };
    
  const resetColors = async () => {
    setColors(defaultColors);
    localStorage.removeItem('app-colors');
    try {
        await settingsCollection.doc('app').set({ colors: defaultColors }, { merge: true });
    } catch(e) {
        console.error("Failed to reset colors in Firestore", e);
    }
  }

  const closeWindow = useCallback((id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindow === id) {
        setActiveWindow(null);
    }
  }, [activeWindow]);
  
  const openWindow = useCallback((id) => {
    if (id === 'admin-panel' && !isLoggedIn) {
      openWindow('login');
      return;
    }

    const existingWindowIndex = windows.findIndex(w => w.id === id);

    if (existingWindowIndex !== -1) {
      focusWindow(id);
      return;
    }
    
    const project = projects.find(p => p.id === id);
    if (project) {
        const availableWidth = window.innerWidth;
        const newWindow = {
            id,
            title: project.name,
            icon: project.icon,
            zIndex: nextZIndex,
            position: { x: Math.random() * (availableWidth * 0.1) + 20, y: Math.random() * 100 + 20 },
            size: {
              width: Math.min(availableWidth * 0.8, id === 'terminal' ? 700 : (id === 'login' ? 500 : (id === 'admin-panel' ? 1024 : 960))),
              height: window.innerHeight * (id === 'terminal' ? 0.5 : (id === 'login' ? 0.6 : 0.7)),
            },
            isMaximized: false,
            preMaximizedState: null,
        };
        setWindows(prev => [...prev, newWindow]);
        setNextZIndex(nextZIndex + 1);
        setActiveWindow(id);
    }
  }, [nextZIndex, windows, projects, isLoggedIn]);

  const focusWindow = useCallback((id) => {
    if (activeWindow === id) return;

    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
    setNextZIndex(nextZIndex + 1);
    setActiveWindow(id);
  }, [nextZIndex, activeWindow]);

  const toggleMaximize = useCallback((id) => {
      setWindows(prev => prev.map(w => {
          if (w.id !== id) return w;
          
          if (w.isMaximized) {
              return { ...w, ...w.preMaximizedState, isMaximized: false, preMaximizedState: null };
          } else {
              const mainEl = document.querySelector('main');
              if (!mainEl) return w; // Should not happen
              const rect = mainEl.getBoundingClientRect();

              return {
                  ...w,
                  preMaximizedState: { position: w.position, size: w.size },
                  position: { x: 0, y: 0 },
                  size: { width: rect.width, height: rect.height },
                  isMaximized: true,
              };
          }
      }));
  }, []);
  
  const handleUpdateSettings = async (updatedSettings: any) => {
    const dataToSave = { ...updatedSettings };

    // If skills is a string (from textarea), convert it to an array.
    if (typeof dataToSave.skills === 'string') {
        dataToSave.skills = dataToSave.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    
    try {
        await settingsCollection.doc('app').set(dataToSave, { merge: true });
        // Update local state to reflect changes immediately.
        // The context will automatically provide the new values to consumers.
        setSettings(prev => ({...(prev || {}), ...dataToSave}));
        alert("Settings saved successfully!");
    } catch (error) {
        console.error("Error updating settings:", error);
        alert("Failed to update settings.");
    }
  };
  
  const handleUpdateProject = async (updatedProject: Project) => {
    try {
        await projectsCollection.doc(updatedProject.id).set(updatedProject, { merge: true });
    } catch (error) {
        console.error("Error updating project:", error);
        alert("Failed to update project.");
    }
  };
  
  const handleCreateProject = async (newProject: Project) => {
    try {
        await projectsCollection.doc(newProject.id).set(newProject);
    } catch (error) {
        console.error("Error creating project:", error);
        alert("Failed to create project.");
    }
  };

  const handleLoginSuccess = useCallback(() => {
    openWindow('admin-panel');
    closeWindow('login');
  }, [openWindow, closeWindow]);

  const handleActionStart = useCallback((id, action, e, direction = '') => {
      focusWindow(id);
      const win = windows.find(w => w.id === id);
      if (!win || (action === 'drag' && win.isMaximized)) return;

      activeActionRef.current = {
          id,
          action,
          direction,
          startPos: { x: e.clientX, y: e.clientY },
          startRect: { ...win.position, ...win.size },
      };
  }, [windows, focusWindow]);

  useEffect(() => {
    const handleMouseMove = (e) => {
        if (!activeActionRef.current) return;
        
        const { id, action, direction, startPos, startRect } = activeActionRef.current;
        const mainEl = document.querySelector('main');

        if (action === 'drag') {
            const newPosition = {
                x: startRect.x + (e.clientX - startPos.x),
                y: startRect.y + (e.clientY - startPos.y),
            };

            if (mainEl) {
                const rect = mainEl.getBoundingClientRect();
                const SNAP_EDGE_THRESHOLD = 5;
                let newSnapPreview = null;

                const atTopEdge = e.clientY <= rect.top + SNAP_EDGE_THRESHOLD;
                const atLeftEdge = e.clientX <= rect.left + SNAP_EDGE_THRESHOLD;
                const atRightEdge = e.clientX >= rect.right - SNAP_EDGE_THRESHOLD;

                if (atTopEdge) {
                    newSnapPreview = { x: 0, y: 0, width: rect.width, height: rect.height, snapType: 'maximized' };
                } else if (atLeftEdge) {
                    newSnapPreview = { x: 0, y: 0, width: Math.ceil(rect.width / 2), height: rect.height, snapType: 'side' };
                } else if (atRightEdge) {
                    newSnapPreview = { x: Math.floor(rect.width / 2), y: 0, width: Math.floor(rect.width / 2), height: rect.height, snapType: 'side' };
                }
                setSnapPreview(newSnapPreview);
            }
            
            setWindows(prev => prev.map(w => w.id === id ? { ...w, position: newPosition, isMaximized: false } : w));
        } else if (action === 'resize') {
            let newWidth = startRect.width;
            let newHeight = startRect.height;
            let newLeft = startRect.x;
            let newTop = startRect.y;

            const deltaX = e.clientX - startPos.x;
            const deltaY = e.clientY - startPos.y;

            if (direction.includes('right')) newWidth = startRect.width + deltaX;
            if (direction.includes('bottom')) newHeight = startRect.height + deltaY;
            if (direction.includes('left')) {
                newWidth = startRect.width - deltaX;
                newLeft = startRect.x + deltaX;
            }
            if (direction.includes('top')) {
                newHeight = startRect.height - deltaY;
                newTop = startRect.y + deltaY;
            }

            if (newWidth < MIN_WIDTH) {
                if (direction.includes('left')) newLeft = newLeft + newWidth - MIN_WIDTH;
                newWidth = MIN_WIDTH;
            }
            if (newHeight < MIN_HEIGHT) {
                if (direction.includes('top')) newTop = newTop + newHeight - MIN_HEIGHT;
                newHeight = MIN_HEIGHT;
            }

            setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x: newLeft, y: newTop }, size: { width: newWidth, height: newHeight }, isMaximized: false } : w));
        }
    };
    
    const handleMouseUp = () => {
        if (snapPreview && activeActionRef.current) {
            const { id } = activeActionRef.current;
            setWindows(prev => prev.map(w => {
                if (w.id !== id) return w;
                const isMaximizing = snapPreview.snapType === 'maximized';
                return {
                    ...w,
                    preMaximizedState: isMaximizing ? { position: w.position, size: w.size } : w.preMaximizedState,
                    position: { x: snapPreview.x, y: snapPreview.y },
                    size: { width: snapPreview.width, height: snapPreview.height },
                    isMaximized: isMaximizing,
                };
            }));
        }
        activeActionRef.current = null;
        setSnapPreview(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [snapPreview]);

  const handleSetupComplete = () => {
    // Re-check status to load data properly
    setIsCheckingSetup(true);
    setNeedsSetup(false);
  };
  
  const themeValue = useMemo(() => ({ theme, toggleTheme, setTheme, colors, updateColors, resetColors }), [theme, colors]);

  const desktopBackgroundStyle = useMemo(() => {
    if (settings?.wallpaperUrl) {
      return {
        backgroundImage: `url('${settings.wallpaperUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {};
  }, [settings]);

  if (isCheckingSetup) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900">
          <div className="gradient-bg fixed inset-0 -z-10"></div>
      </div>
    );
  }

  if (needsSetup) {
    return <SetupScreen onSetupComplete={handleSetupComplete} />;
  }

  return (
    <ThemeContext.Provider value={themeValue}>
        <SettingsContext.Provider value={settings}>
            <div className="h-screen w-screen flex flex-col">
                <div
                    className={`fixed inset-0 -z-10 transition-all duration-500 ${!settings?.wallpaperUrl ? 'gradient-bg' : ''}`}
                    style={desktopBackgroundStyle}
                ></div>
                <main className="flex-grow h-full w-full relative">
                <Desktop 
                    onOpen={openWindow} 
                    projects={projects.filter(p => {
                    if (p.id === 'login' && isLoggedIn) return false;
                    if (p.id === 'admin-panel' && !isLoggedIn) return false;
                    return true;
                    })}
                />
                {snapPreview && <div className="snap-preview" style={{ top: snapPreview.y, left: snapPreview.x, width: snapPreview.width, height: snapPreview.height }} />}
                {windows.map(win => {
                    const project = projects.find(p => p.id === win.id);
                    return (
                    <Window
                        key={win.id}
                        id={win.id}
                        title={win.title}
                        position={win.position}
                        size={win.size}
                        zIndex={win.zIndex}
                        isActive={activeWindow === win.id}
                        isMaximized={win.isMaximized}
                        onClose={closeWindow}
                        onFocus={focusWindow}
                        onMaximize={toggleMaximize}
                        onActionStart={handleActionStart}
                    >
                        {win.id === 'terminal' ? (
                        <Terminal onOpen={openWindow} onClose={() => closeWindow(win.id)} projects={projects}/>
                        ) : win.id === 'login' ? (
                        <Login onLoginSuccess={handleLoginSuccess}/>
                        ) : win.id === 'admin-panel' ? (
                        <AdminPanel 
                            projects={projects} 
                            onUpdateProject={handleUpdateProject} 
                            onCreateProject={handleCreateProject}
                            onUpdateSettings={handleUpdateSettings}
                        />
                        ) : (
                        project && <ProjectContent project={project} />
                        )}
                    </Window>
                    );
                })}
                </main>
                <Taskbar openWindows={windows} onFocus={focusWindow} activeWindow={activeWindow} onOpen={openWindow} settings={settings}/>
            </div>
      </SettingsContext.Provider>
    </ThemeContext.Provider>
  );
}