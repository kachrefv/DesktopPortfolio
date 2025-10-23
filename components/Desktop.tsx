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
    const taskbarHeight = 48;
    const desktopHeight = window.innerHeight - taskbarHeight;
    const maxIconsPerColumn = Math.floor((desktopHeight - PADDING * 2) / (ICON_HEIGHT + GAP_Y));

    setIconPositions(prevPositions => {
      const newPositions = { ...prevPositions };
      const positionedIds = Object.keys(prevPositions);
      
      const newItems = desktopItems.filter(item => !positionedIds.includes(item.id));

      if (newItems.length === 0) {
        // This check is important to prevent unnecessary re-renders or loops
        // if projects array is updated but no new desktop icons are added.
        return prevPositions;
      }
      
      let currentItemIndex = positionedIds.length;
      
      newItems.forEach(project => {
        const col = Math.floor(currentItemIndex / maxIconsPerColumn);
        const row = currentItemIndex % maxIconsPerColumn;
        newPositions[project.id] = {
          x: PADDING + col * (ICON_WIDTH + GAP_X),
          y: PADDING + row * (ICON_HEIGHT + GAP_Y),
        };
        currentItemIndex++;
      });
      
      return newPositions;
    });
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
