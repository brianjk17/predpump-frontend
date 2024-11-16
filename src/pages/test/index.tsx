import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FpmmABI from "../../contracts/fpmm/fpmmAbi.json"

const MarketDataDisplay = ({  }) => {
    const marketAddress = "0x8ff3801288a85ea261e4277d44e1131ea736f77b";
    const [prices, setPrices] = useState({
        yesPrice: 0,
        noPrice: 0,
        sharePrice: 0
      });
      const [loading, setLoading] = useState(true);
    
      const calculateProbability = (balance: any, totalBalance: any) => {
        if (totalBalance === 0) return 0;
        return (balance / totalBalance * 100).toFixed(2);
      };
    
      const formatSharePrice = (price: any) => {
        return Number().toFixed(4);
      };
    
      useEffect(() => {
        const fetchMarketData = async () => {
          try {
            setLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(marketAddress, FpmmABI, provider);
            
            // Get pool balances
            const balances = await contract.getPoolBalances();
            // Convert to numbers for calculation
            const yesBalance = Number(ethers.formatUnits(balances[0], 18));
            const noBalance = Number(ethers.formatUnits(balances[1], 18));
            const totalBalance = yesBalance + noBalance;
    
            // Calculate probabilities
            const yesProbability = calculateProbability(yesBalance, totalBalance);
            const noProbability = calculateProbability(noBalance, totalBalance);
            
            const sharePrice = await contract.getSharePrice();
            
            setPrices({
              yesPrice: Number(yesProbability),
              noPrice: Number(noProbability),
              sharePrice: Number(sharePrice)
            });
          } catch (error) {
            console.error('Error fetching market data:', error);
          } finally {
            setLoading(false);
          }
        };
    
        if (marketAddress) {
          fetchMarketData();
        }
      }, [marketAddress]);
    
      return (
        <div className="w-full max-w-md bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Market Probabilities</h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center p-4">Loading...</div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg 
                      className="w-5 h-5 text-green-500" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12l2 2 4-4" />
                    </svg>
                    <span className="font-medium">Yes</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-700">
                      {prices.yesPrice}%
                    </div>
                  </div>
                </div>
    
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg 
                      className="w-5 h-5 text-red-500" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9l-6 6M9 9l6 6" />
                    </svg>
                    <span className="font-medium">No</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-700">
                      {prices.noPrice}%
                    </div>
                  </div>
                </div>
    
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Share Price:</span>
                    <span className="font-medium">
                      {formatSharePrice(prices.sharePrice)} tokens
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };
    
    export default MarketDataDisplay;