import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { TOOLS, BUILDING_PRICES } from '../utils/constants';
import { RotateCw, DollarSign } from 'lucide-react';

export const Toolbar: React.FC = () => {
  const { selectedTool, setSelectedTool, resetGame, openSettlement, budgetMode, budget, toggleBudgetMode, grid } = useGameStore();

  const getToolPrice = (type: string) => BUILDING_PRICES[type] ?? 0;

  const canAffordTool = (type: string) => {
    if (!budgetMode) return true;
    const price = getToolPrice(type);
    return budget >= price;
  };

  const getPriceDifference = (type: string) => {
    const price = getToolPrice(type);
    return price - budget;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            🛠️ 建筑工具
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <DollarSign size={12} /> 预算
            </span>
            <button
              onClick={toggleBudgetMode}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
                budgetMode ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  budgetMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TOOLS.map((tool) => {
            const price = getToolPrice(tool.type);
            const affordable = canAffordTool(tool.type);
            const diff = getPriceDifference(tool.type);
            return (
              <button
                key={tool.type}
                onClick={() => affordable && setSelectedTool(tool.type)}
                disabled={budgetMode && !affordable}
                className={`
                  flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 relative
                  ${selectedTool === tool.type
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300'
                    : budgetMode && !affordable
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:scale-102'
                  }
                `}
              >
                <span className="text-2xl">{tool.emoji}</span>
                <span className="text-xs font-semibold">{tool.name}</span>
                {budgetMode && (
                  <span className={`text-[10px] font-bold ${
                    selectedTool === tool.type ? 'text-blue-100' : affordable ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {affordable ? `💰${price}` : `还差${diff}`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50">
        <h3 className="text-sm font-bold text-gray-700 mb-2">💡 操作提示</h3>
        <ul className="text-xs text-gray-600 space-y-1.5">
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-[10px]">
              🖱️
            </span>
            左键放置/拆除
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-[10px]">
              <RotateCw size={10} />
            </span>
            右键/R键旋转电线
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center text-[10px]">
              🔧
            </span>
            点击故障建筑维修
          </li>
        </ul>
      </div>

      <button
        onClick={openSettlement}
        className="bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
      >
        📊 查看结算
      </button>

      <button
        onClick={resetGame}
        className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
      >
        🔄 重新开始
      </button>
    </div>
  );
};
