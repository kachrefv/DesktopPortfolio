import React, { useRef } from 'react';
import * as Lucide from 'lucide-react';
import { Project } from '../types';

interface DesktopIconProps {
  project: Project;
  onOpen: (id: string) => void;
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ project, onOpen, position, onPositionChange }) => {
  const Icon = Lucide[project.icon] || Lucide.Folder;
  const dragStateRef = useRef({
    isDragging: false,
    hasMoved: false,
    startX: 0,
    startY: 0,
    iconStartX: 0,
    iconStartY: 0,
  });

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragStateRef.current.isDragging) return;

    const dx = e.clientX - dragStateRef.current.startX;
    const dy = e.clientY - dragStateRef.current.startY;
    
    if (!dragStateRef.current.hasMoved && Math.sqrt(dx*dx + dy*dy) < 5) {
      // Don't drag if mouse moved only a few pixels
      return;
    }
    dragStateRef.current.hasMoved = true;

    const newX = dragStateRef.current.iconStartX + dx;
    const newY = dragStateRef.current.iconStartY + dy;
    
    onPositionChange(project.id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (dragStateRef.current.isDragging) {
      dragStateRef.current.isDragging = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent text selection and other default behaviors
    e.preventDefault();
    
    dragStateRef.current = {
      isDragging: true,
      hasMoved: false,
      startX: e.clientX,
      startY: e.clientY,
      iconStartX: position.x,
      iconStartY: position.y,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = () => {
    // Only open if it wasn't a drag
    if (!dragStateRef.current.hasMoved) {
      onOpen(project.id);
    }
  };
  
  return (
    <button
      className="desktop-icon absolute"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <Icon size={40} className="mb-1 drop-shadow-lg" />
      <span className="text-xs leading-tight line-clamp-2 select-none">{project.name}</span>
    </button>
  );
};

export default DesktopIcon;