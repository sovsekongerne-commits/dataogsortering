import React from 'react';
import { DraggableObject, BucketData } from '../types';

interface DraggableItemProps {
  item: DraggableObject;
  bucketConfig: BucketData;
  onClick?: () => void;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ item, bucketConfig, onClick }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('id', item.id);
    e.dataTransfer.setData('type', item.type);
    e.dataTransfer.effectAllowed = 'move';
  };

  const Icon = bucketConfig.icon;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      className={`
        cursor-grab active:cursor-grabbing hover:scale-110 transition-transform 
        bg-white p-1 rounded-full shadow-sm border-2 border-gray-100
        flex items-center justify-center animate-bounce-in select-none
      `}
      style={{
        width: '64px',
        height: '64px',
        animationDelay: `${Math.random() * 0.5}s`
      }}
    >
      {/* 
        We use the custom colorful icons, so no 'color' style is needed.
        Increased size slightly for better visibility.
      */}
      <Icon size={48} />
    </div>
  );
};