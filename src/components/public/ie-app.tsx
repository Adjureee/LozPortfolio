import React, { useState, useRef } from 'react';
import { RetroWindow } from './retro-window';
import { Globe, ArrowLeft, ArrowRight, X, RotateCw } from 'lucide-react';

const BOOKMARKS = [
  { label: 'LozPortfolio', url: 'https://github.com/Adjureee/LozPortfolio' },
  { label: 'GitHub Profile', url: 'https://github.com/Adjureee' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/johnnlozada/' },
];

const HOME_URL = BOOKMARKS[0].url;

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
  const [url, setUrl] = useState(HOME_URL);
  const [inputUrl, setInputUrl] = useState(HOME_URL);
  const [iframeKey, setIframeKey] = useState(0);
  const historyStack = useRef<string[]>([HOME_URL]);
  const historyIdx = useRef(0);

  const navigate = (target: string) => {
    // Trim the history forward stack when navigating to a new URL
    historyStack.current = historyStack.current.slice(0, historyIdx.current + 1);
    historyStack.current.push(target);
    historyIdx.current = historyStack.current.length - 1;
    setUrl(target);
    setInputUrl(target);
    setIframeKey(k => k + 1);
  };

  const goBack = () => {
    if (historyIdx.current <= 0) return;
    historyIdx.current -= 1;
    const prev = historyStack.current[historyIdx.current];
    setUrl(prev);
    setInputUrl(prev);
    setIframeKey(k => k + 1);
  };

  const goForward = () => {
    if (historyIdx.current >= historyStack.current.length - 1) return;
    historyIdx.current += 1;
    const next = historyStack.current[historyIdx.current];
    setUrl(next);
    setInputUrl(next);
    setIframeKey(k => k + 1);
  };

  const handleAddressSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let target = inputUrl.trim();
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = 'https://' + target;
      }
      navigate(target);
    }
  };

  const canBack = historyIdx.current > 0;
  const canForward = historyIdx.current < historyStack.current.length - 1;

  return (
    <RetroWindow
      title="Internet Explorer"
      icon={<Globe size={12} color="white" />}
      width={720}
      height={540}
      defaultPosition={{ x: 80, y: 60 }}
      onClose={onClose}
      constraintsRef={constraintsRef}
      zIndex={zIndex}
      onPointerDown={onFocus}
    >
      {/* Menu Bar */}
      <div className="flex gap-4 px-2 py-0.5 text-sm bg-[#c0c0c0] text-black border-b border-[#808080]">
        <span className="hover:bg-[#000080] hover:text-white cursor-pointer px-1">File</span>
        <span className="hover:bg-[#000080] hover:text-white cursor-pointer px-1">Edit</span>
        <span className="hover:bg-[#000080] hover:text-white cursor-pointer px-1">View</span>
        <span className="hover:bg-[#000080] hover:text-white cursor-pointer px-1">Favorites</span>
        <span className="hover:bg-[#000080] hover:text-white cursor-pointer px-1">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-[#c0c0c0] border-b border-[#808080]">
        <button
          onClick={goBack}
          disabled={!canBack}
          className="flex flex-col items-center justify-center p-1 w-10 disabled:opacity-40 hover:not-disabled:shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_#808080,inset_2px_2px_#fff] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] text-black"
        >
          <ArrowLeft size={14} />
          <span className="text-[9px] leading-none mt-0.5">Back</span>
        </button>
        <button
          onClick={goForward}
          disabled={!canForward}
          className="flex flex-col items-center justify-center p-1 w-10 disabled:opacity-40 hover:not-disabled:shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_#808080,inset_2px_2px_#fff] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] text-black"
        >
          <ArrowRight size={14} />
          <span className="text-[9px] leading-none mt-0.5">Forward</span>
        </button>
        <button
          onClick={() => { setIframeKey(k => k + 1); }}
          className="flex flex-col items-center justify-center p-1 w-10 hover:shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_#808080,inset_2px_2px_#fff] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] text-black"
        >
          <RotateCw size={14} />
          <span className="text-[9px] leading-none mt-0.5">Refresh</span>
        </button>
        <button
          onClick={() => navigate(HOME_URL)}
          className="flex flex-col items-center justify-center p-1 w-10 hover:shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_#808080,inset_2px_2px_#fff] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] text-black"
        >
          <Globe size={14} />
          <span className="text-[9px] leading-none mt-0.5">Home</span>
        </button>

        {/* Separator */}
        <div className="w-px h-8 bg-[#808080] mx-1" />

        {/* Address Bar */}
        <span className="text-sm text-black whitespace-nowrap">Address</span>
        <div className="flex-1 bg-white shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf,inset_2px_2px_#808080,inset_-2px_-2px_#fff] flex items-center px-1 py-0.5">
          <Globe size={12} className="text-gray-500 mr-1 flex-shrink-0" />
          <input
            type="text"
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            onKeyDown={handleAddressSubmit}
            className="w-full bg-transparent border-none outline-none text-sm text-black"
            spellCheck={false}
          />
        </div>
        <button
          onClick={() => navigate(inputUrl)}
          className="px-2 py-0.5 text-sm bg-[#c0c0c0] border-t border-l border-t-white border-l-white border-b border-r border-b-[#808080] border-r-[#808080] text-black hover:bg-[#d4d4d4] active:border-t-[#808080] active:border-l-[#808080]"
        >
          Go
        </button>
      </div>

      {/* Links / Bookmarks Bar */}
      <div className="flex items-center gap-1 px-2 py-0.5 bg-[#c0c0c0] border-b border-[#808080]">
        <span className="text-xs text-black mr-1 whitespace-nowrap">Links:</span>
        {BOOKMARKS.map(bm => (
          <button
            key={bm.url}
            onClick={() => navigate(bm.url)}
            className="text-xs text-black underline px-1 hover:bg-[#000080] hover:text-white hover:no-underline whitespace-nowrap"
          >
            {bm.label}
          </button>
        ))}
      </div>

      {/* Recessed Content Area (Iframe) */}
      <div className="flex-1 min-h-0 bg-white shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf,inset_2px_2px_#808080,inset_-2px_-2px_#fff] p-[2px] overflow-hidden flex flex-col">
        <iframe
          key={iframeKey}
          src={url}
          className="w-full h-full border-none bg-white"
          title="Internet Explorer Viewer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center px-2 py-0.5 bg-[#c0c0c0] border-t border-[#808080] text-xs text-black">
        <div className="flex-1 shadow-[inset_1px_1px_#808080,inset_-1px_-1px_#dfdfdf] px-1 mr-1 truncate">
          {url}
        </div>
        <div className="shadow-[inset_1px_1px_#808080,inset_-1px_-1px_#dfdfdf] px-2">
          Internet zone
        </div>
      </div>
    </RetroWindow>
  );
}
