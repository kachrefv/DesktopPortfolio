import React, { useState, useEffect, useCallback } from 'react';
import DesktopIcon from './DesktopIcon';
import { Project } from '../types';

const ICON_WIDTH = 90;
const ICON_HEIGHT = 90;
const GAP_X = 16;
const GAP_Y = 8;
const PADDING = 16;

interface DesktopProps {
  onOpen: (id: string) => void;
  projects: Project[];
}

const Desktop: React.FC<DesktopProps> = ({ onOpen, projects }) => {
  const [iconPositions, setIconPositions] = useState<{ [key: string]: { x: number, y: number } }>({});
  
  const desktopItems = projects.filter(p => {
    if (p.id === 'login' || p.id === 'admin-panel') {
      return false;
    }
    // Only show the README/About Me icon if it has been configured and saved to Firestore.
    if (p.id === 'about-me' && !p.isFirestore) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    const calculatePositions = () => {
      const mainEl = document.querySelector('main');
      if (!mainEl) return;

      const desktopHeight = mainEl.clientHeight;
      const maxIconsPerColumn = Math.floor((desktopHeight - PADDING * 2 + GAP_Y) / (ICON_HEIGHT + GAP_Y));

      setIconPositions(prevPositions => {
        const allItemIds = new Set(desktopItems.map(p => p.id));
        const validPrevPositions: { [key: string]: { x: number, y: number } } = {};
        
        // Filter out positions for projects that no longer exist
        Object.keys(prevPositions).forEach(id => {
            if (allItemIds.has(id)) {
                validPrevPositions[id] = prevPositions[id];
            }
        });

        const positionedIds = Object.keys(validPrevPositions);
        const newItems = desktopItems.filter(item => !positionedIds.includes(item.id));
        const newPositions = { ...validPrevPositions };
        let currentItemIndex = positionedIds.length;
        
        newItems.forEach(project => {
            if (maxIconsPerColumn > 0) { // Avoid division by zero
                const col = Math.floor(currentItemIndex / maxIconsPerColumn);
                const row = currentItemIndex % maxIconsPerColumn;
                newPositions[project.id] = {
                    x: PADDING + col * (ICON_WIDTH + GAP_X),
                    y: PADDING + row * (ICON_HEIGHT + GAP_Y),
                };
                currentItemIndex++;
            }
        });
        
        return newPositions;
      });
    };
    
    calculatePositions();
    window.addEventListener('resize', calculatePositions);
    return () => window.removeEventListener('resize', calculatePositions);
  }, [projects]);

  const handlePositionChange = useCallback((id, newPosition) => {
    setIconPositions(prev => ({
      ...prev,
      [id]: newPosition
    }));
  }, []);

  return (
    <div className="w-full h-full relative">
      {desktopItems.map((project) => {
        const position = iconPositions[project.id];
        if (!position) return null; // Don't render until position is calculated
        return (
          <DesktopIcon
            key={project.id}
            project={project}
            onOpen={onOpen}
            position={position}
            onPositionChange={handlePositionChange}
          />
        );
      })}
    </div>
  );
};

export default Desktop;
