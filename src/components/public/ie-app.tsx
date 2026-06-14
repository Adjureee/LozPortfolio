import React, { useState } from 'react';
import { RetroWindow } from './retro-window';
import { Globe, ArrowLeft, ArrowRight, X, RotateCw } from 'lucide-react';

export function IeApp({ 
  onClose,
  constraintsRef,
  zIndex,
  onFocus
}: { 
  onClose: () => void;
  constraintsRef?: React.RefObject<Element | null>;
  zIndex?: number;
  onFocus?: () => void;
}) {
  const [url, setUrl] = useState('https://example.com');
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <RetroWindow
      title="Internet Explorer"
      icon={<Globe size={12} color="white" />}
      width={700}
      height={500}
      defaultPosition={{ x: 100, y: 100 }}
      onClose={onClose}
      constraintsRef={constraintsRef}
      zIndex={zIndex}
      onPointerDown={onFocus}
    >
      {/* Menu Bar */}
      <div className="flex gap-4 px-2 py-1 text-sm bg-[#c0c0c0] text-black">
        <span className="hover:bg-[#000080] hover:text-white cursor-pointer px-1">File</span>
        <span className="hover:bg-[#000080] hover:text-white cursor-pointer px-1">Edit</span>
        <span className="hover:bg-[#000080] hover:text-white cursor-pointer px-1">View</span>
        <span className="hover:bg-[#000080] hover:text-white cursor-pointer px-1">Favorites</span>
        <span className="hover:bg-[#000080] hover:text-white cursor-pointer px-1">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-2 py-1 bg-[#c0c0c0] border-b border-[#808080]">
        <button className="flex flex-col items-center justify-center p-1 hover:shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_#808080,inset_2px_2px_#fff] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf,inset_2px_2px_#808080,inset_-2px_-2px_#fff] text-black">
          <ArrowLeft size={16} />
          <span className="text-[10px]">Back</span>
        </button>
        <button className="flex flex-col items-center justify-center p-1 hover:shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_#808080,inset_2px_2px_#fff] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf,inset_2px_2px_#808080,inset_-2px_-2px_#fff] text-black opacity-50">
          <ArrowRight size={16} />
          <span className="text-[10px]">Forward</span>
        </button>
        <button className="flex flex-col items-center justify-center p-1 hover:shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_#808080,inset_2px_2px_#fff] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf,inset_2px_2px_#808080,inset_-2px_-2px_#fff] text-black">
          <X size={16} />
          <span className="text-[10px]">Stop</span>
        </button>
        <button 
          onClick={() => setIframeKey(k => k + 1)}
          className="flex flex-col items-center justify-center p-1 hover:shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_#808080,inset_2px_2px_#fff] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf,inset_2px_2px_#808080,inset_-2px_-2px_#fff] text-black"
        >
          <RotateCw size={16} />
          <span className="text-[10px]">Refresh</span>
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-2 px-2 py-1 bg-[#c0c0c0]">
        <span className="text-sm text-black">Address</span>
        <div className="flex-1 bg-white shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf,inset_2px_2px_#808080,inset_-2px_-2px_#fff] flex items-center px-1">
          <Globe size={14} className="text-gray-500 mr-1" />
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm text-black"
          />
        </div>
      </div>

      {/* Recessed Content Area (Iframe) */}
      <div className="flex-1 min-h-0 bg-white shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf,inset_2px_2px_#808080,inset_-2px_-2px_#fff] p-[2px] overflow-hidden flex flex-col">
        <iframe 
          key={iframeKey}
          src={url} 
          className="w-full h-full border-none bg-white"
          title="Internet Explorer Viewer"
        />
      </div>
    </RetroWindow>
  );
}
