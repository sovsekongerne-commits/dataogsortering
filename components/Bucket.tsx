import React from 'react';
import { BucketData, ItemType } from '../types';

interface BucketProps {
  data: BucketData;
  onDrop: (droppedType: ItemType, targetBucketType: ItemType) => void;
  isOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
}

export const Bucket: React.FC<BucketProps> = ({ data, onDrop, isOver, onDragOver, onDragLeave }) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedType = e.dataTransfer.getData('type') as ItemType;
    // We pass both the dropped item type AND this bucket's current assigned type
    // This allows the parent to handle the "Swap" logic if the bucket is empty
    onDrop(droppedType, data.type);
  };

  const Icon = data.icon;
  const isEmpty = data.count === 0;

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-end p-4 rounded-xl transition-all duration-500
        ${isEmpty 
          ? 'bg-gray-50 border-4 border-dashed border-gray-300 shadow-inner' 
          : `${data.color} shadow-lg border-b-8 border-black/20`
        }
        ${isOver ? 'scale-105 ring-4 ring-indigo-300/50 -translate-y-1' : 'scale-100'}
        h-36 w-full sm:h-44
      `}
    >
      {/* Icon floating above - ONLY VISIBLE IF NOT EMPTY */}
      {!isEmpty && (
        <div className={`
          absolute -top-8 p-2 rounded-full transition-all duration-500 bg-white shadow-lg border-4 border-white
          ${isOver ? 'scale-110 rotate-12' : ''}
        `}>
          <Icon size={48} />
        </div>
      )}
      
      {/* Label - ONLY VISIBLE IF NOT EMPTY. Count removed to encourage graph reading. */}
      <span className={`
        font-bold uppercase tracking-wider text-sm sm:text-base drop-shadow-md transition-all duration-500 text-white mb-2
        ${isEmpty ? 'opacity-0' : 'opacity-100'}
      `}>
        {data.label}
      </span>
    </div>
  );
};