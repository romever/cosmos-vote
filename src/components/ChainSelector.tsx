import React, { useState, useRef, useEffect } from 'react';
import { ChainConfig } from '../config/chains';

interface ChainSelectorProps {
  chains: ChainConfig[];
  selectedChain: ChainConfig;
  onSelect: (chain: ChainConfig) => void;
  chainAddresses: Record<string, string>;
}

interface ActiveProposals {
  [chainId: string]: number;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({
  chains,
  selectedChain,
  onSelect,
  chainAddresses
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeProposals, setActiveProposals] = useState<ActiveProposals>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchActiveProposals = async () => {
      const proposals: ActiveProposals = {};
      
      await Promise.all(chains.map(async (chain) => {
        try {
          const response = await fetch(
            `${chain.restEndpoint}/cosmos/gov/v1/proposals?proposal_status=2`
          );
          const data = await response.json();
          if (data.proposals && data.proposals.length > 0) {
            proposals[chain.chainId] = data.proposals.length;
          }
        } catch (error) {
          console.error(`获取 ${chain.displayName} 提案失败:`, error);
        }
      }));
      
      setActiveProposals(proposals);
    };

    fetchActiveProposals();
    const interval = setInterval(fetchActiveProposals, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [chains]);

  const filteredChains = chains.filter(chain => 
    chain.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white px-4 py-2 rounded-lg shadow-md flex items-center justify-between w-64
                 hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{selectedChain.displayName}</span>
            {activeProposals[selectedChain.chainId] && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {activeProposals[selectedChain.chainId]}
              </span>
            )}
          </div>
          {chainAddresses[selectedChain.chainId] && (
            <span className="text-xs text-gray-500 truncate w-40">
              {chainAddresses[selectedChain.chainId].slice(0, 20)}...
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
          <div className="p-2">
            <input
              type="text"
              placeholder="搜索链..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredChains.map((chain) => (
              <button
                key={chain.chainId}
                onClick={() => {
                  onSelect(chain);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between
                          ${selectedChain.chainId === chain.chainId ? 'bg-indigo-50' : ''}`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{chain.displayName}</span>
                    {activeProposals[chain.chainId] && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {activeProposals[chain.chainId]}
                      </span>
                    )}
                  </div>
                  {chainAddresses[chain.chainId] && (
                    <span className="text-xs text-gray-500 truncate">
                      {chainAddresses[chain.chainId].slice(0, 20)}...
                    </span>
                  )}
                </div>
                {activeProposals[chain.chainId] && (
                  <span className="text-xs text-red-600 animate-pulse">
                    活跃提案
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChainSelector; 