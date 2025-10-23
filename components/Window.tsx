import React, { ReactNode } from 'react';
import { X, Square, Minus, Copy } from 'lucide-react';

interface WindowProps {
  id: string;
  children: ReactNode;
  title: string;
  position: { x: number; y: number; };
  size: { width: number; height: number };
  zIndex: number;
  isActive: boolean;
  isMaximized: boolean;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMaximize: (id: string) => void;
  onActionStart: (id: string, action: 'drag' | 'resize', e: React.MouseEvent, direction?: string) => void;
}

const Window: React.FC<WindowProps> = ({ 
  id, 
  children, 
  title, 
  position, 
  size,
  zIndex, 
  isActive, 
  isMaximized,
  onClose, 
  onFocus, 
  onMaximize,
  onActionStart 
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
     if (!(e.target as HTMLElement).closest('.window-controls-button') && !(e.target as HTMLElement).closest('.resize-handle')) {
        onFocus(id);
    }
  };

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls-button')) return;
    onActionStart(id, 'drag', e);
  };
  
  return (
    <div
      className={`window-container ${isActive ? 'active' : ''} ${isMaximized ? 'rounded-none' : 'rounded-lg'}`}
      style={{ 
        top: position.y, 
        left: position.x, 
        zIndex, 
        width: size.width, 
        height: size.height,
        transition: isMaximized ? 'none' : 'width 150ms ease-in-out, height 150ms ease-in-out, top 150ms ease-in-out, left 150ms ease-in-out',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Resize Handles */}
      {!isMaximized && (
        <>
          <div onMouseDown={(e) => onActionStart(id, 'resize', e, 'top')} className="resize-handle absolute -top-1 left-0 w-full h-2 cursor-ns-resize" />
          <div onMouseDown={(e) => onActionStart(id, 'resize', e, 'right')} className="resize-handle absolute top-0 -right-1 h-full w-2 cursor-ew-resize" />
          <div onMouseDown={(e) => onActionStart(id, 'resize', e, 'bottom')} className="resize-handle absolute -bottom-1 left-0 w-full h-2 cursor-ns-resize" />
          <div onMouseDown={(e) => onActionStart(id, 'resize', e, 'left')} className="resize-handle absolute top-0 -left-1 h-full w-2 cursor-ew-resize" />
          <div onMouseDown={(e) => onActionStart(id, 'resize', e, 'top-left')} className="resize-handle absolute -top-1 -left-1 w-3 h-3 cursor-nwse-resize z-10" />
          <div onMouseDown={(e) => onActionStart(id, 'resize', e, 'top-right')} className="resize-handle absolute -top-1 -right-1 w-3 h-3 cursor-nesw-resize z-10" />
          <div onMouseDown={(e) => onActionStart(id, 'resize', e, 'bottom-right')} className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 cursor-nwse-resize z-10" />
          <div onMouseDown={(e) => onActionStart(id, 'resize', e, 'bottom-left')} className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 cursor-nesw-resize z-10" />
        </>
      )}

      <header
        className={`window-drag-handle window-header flex items-center justify-between pl-3 pr-1 py-1 h-8 flex-shrink-0 ${isMaximized ? '' : 'rounded-t-lg'}`}
        onMouseDown={handleHeaderMouseDown}
        onDoubleClick={() => onMaximize(id)}
      >
        <span className="text-sm font-medium select-none text-primary">{title}</span>
        <div className="window-controls flex items-center text-primary">
          <button className="window-controls-button p-2 rounded-sm hover:bg-black/10 dark:hover:bg-white/10 transition-colors" disabled><Minus size={14} /></button>
          <button onClick={() => onMaximize(id)} className="window-controls-button p-2 rounded-sm hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            {isMaximized ? <Copy size={14} /> : <Square size={14} />}
          </button>
          <button onClick={() => onClose(id)} className="window-controls-button p-2 rounded-sm hover:bg-red-500 hover:text-white transition-colors"><X size={14} /></button>
        </div>
      </header>
      <main className={`flex-grow overflow-y-auto rounded-b-lg ${id === 'terminal' ? 'p-0' : 'p-2 window-main-content'}`}>
        {children}
      </main>
    </div>
  );
};

export default Window;