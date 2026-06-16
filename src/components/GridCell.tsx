import React from 'react';
import { GridCell as GridCellType, ToolType, BUILDING_PRICES } from '../utils/constants';
import { Building } from './Building';
import { useGameStore } from '../store/useGameStore';

interface GridCellProps {
  cell: GridCellType;
  selectedTool: ToolType;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

export const GridCellComponent: React.FC<GridCellProps> = ({
  cell,
  selectedTool,
  onClick,
  onRightClick,
}) => {
  const { budgetMode, budget, canAfford } = useGameStore();

  const isEmpty = cell.type === 'empty';
  const canPlace = isEmpty && selectedTool !== 'remove';
  const canRemove = !isEmpty && selectedTool === 'remove';
  const canRepair = cell.faulty;
  const affordable = canAfford(selectedTool, cell);

  const showInsufficientBudget = budgetMode && !affordable && (canPlace || canRemove) && !canRepair;

  const price = BUILDING_PRICES[selectedTool] ?? 0;
  const diff = price - budget;

  return (
    <div
      onClick={onClick}
      onContextMenu={onRightClick}
      className={`
        relative w-14 h-14 border border-green-600/30 cursor-pointer
        transition-all duration-150 select-none
        ${isEmpty ? 'bg-green-400/40 hover:bg-green-300/60' : 'bg-green-500/50'}
        ${canPlace && affordable ? 'hover:ring-2 hover:ring-blue-400 hover:ring-inset' : ''}
        ${canRemove && affordable ? 'hover:ring-2 hover:ring-red-400 hover:ring-inset' : ''}
        ${canRepair ? 'ring-2 ring-orange-400 ring-inset animate-pulse' : ''}
        ${cell.powered && !cell.faulty ? 'bg-green-400/60' : ''}
        ${showInsufficientBudget ? 'cursor-not-allowed hover:ring-2 hover:ring-red-500 hover:ring-inset hover:bg-red-200/50' : ''}
      `}
      style={{
        borderRadius: '4px',
      }}
    >
      <Building cell={cell} />
      {canRepair && (
        <div className="absolute inset-0 flex items-center justify-center bg-orange-500/20 z-10">
          <span className="text-xs font-bold text-white drop-shadow-lg">🔧维修</span>
        </div>
      )}
      {showInsufficientBudget && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/30 z-10 rounded">
          <span className="text-[10px] font-bold text-white drop-shadow-lg">💰差{diff}</span>
        </div>
      )}
    </div>
  );
};
