import React from 'react';

interface StatusBarProps {
  dark?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ dark = true }) => {
  const fillColor = dark ? '#121316' : '#FFFFFF';

  return (
    <div className="w-full flex items-center justify-between px-6 pt-2 pb-1 text-[13.5px] font-bold tracking-tight select-none z-30 shrink-0">
      <span style={{ color: fillColor }}>09:41</span>

      <div className="w-24 h-4 bg-black/85 rounded-full flex items-center justify-end pr-2 pointer-events-none shadow-xs">
        <div className="w-2 h-2 rounded-full bg-[#1e293b] border border-neutral-700/50" />
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-end space-x-[2px] h-3">
          <div className="w-[3px] h-[3.5px] rounded-[0.5px]" style={{ backgroundColor: fillColor }} />
          <div className="w-[3px] h-[5.5px] rounded-[0.5px]" style={{ backgroundColor: fillColor }} />
          <div className="w-[3px] h-[8px] rounded-[0.5px]" style={{ backgroundColor: fillColor }} />
          <div className="w-[3px] h-[10.5px] rounded-[0.5px]" style={{ backgroundColor: fillColor }} />
        </div>

        <svg className="w-3.5 h-3" viewBox="0 0 16 12" fill="none">
          <path
            d="M8 9.5C8.55228 9.5 9 9.94772 9 10.5C9 11.0523 8.55228 11.5 8 11.5C7.44772 11.5 7 11.0523 7 10.5C7 9.94772 7.44772 9.5 8 9.5Z"
            fill={fillColor}
          />
          <path
            d="M4.9 7.4C5.7 6.6 6.8 6.1 8 6.1C9.2 6.1 10.3 6.6 11.1 7.4"
            stroke={fillColor}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M2.2 4.7C3.7 3.2 5.8 2.3 8 2.3C10.2 2.3 12.3 3.2 13.8 4.7"
            stroke={fillColor}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>

        <div className="flex items-center">
          <div
            className="w-[20px] h-[10px] rounded-[3px] border flex items-center p-[1px]"
            style={{ borderColor: fillColor }}
          >
            <div className="w-full h-full rounded-[1.5px]" style={{ backgroundColor: fillColor }} />
          </div>
          <div
            className="w-[1.5px] h-[3.5px] rounded-r-[1px] ml-[0.5px]"
            style={{ backgroundColor: fillColor }}
          />
        </div>
      </div>
    </div>
  );
};
