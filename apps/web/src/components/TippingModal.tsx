import { useState } from 'react';
import { useAccount, useBalance, useContractWrite } from 'wagmi';
import { parseEther } from 'viem';

interface TippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientAddress: string;
  imageId: string;
  creatorName?: string;
}

// MOON token contract ABI (ERC20)
const MOON_TOKEN_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const MOON_TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890'; // Replace with actual address

export default function TippingModal({
  isOpen,
  onClose,
  recipientAddress,
  imageId,
  creatorName = 'Creator',
}: TippingModalProps) {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: MOON_TOKEN_ADDRESS,
  });
  
  const [tipAmount, setTipAmount] = useState('10');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { writeAsync: sendTip } = useContractWrite({
    address: MOON_TOKEN_ADDRESS,
    abi: MOON_TOKEN_ABI,
    functionName: 'transfer',
  });

  const handleTip = async () => {
    if (!address || !tipAmount) return;
    
    setIsProcessing(true);
    try {
      const amount = parseEther(tipAmount);
      
      // Send tip
      const tx = await sendTip({
        args: [recipientAddress, amount],
      });
      
      // Record tip in backend
      await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: address,
          to: recipientAddress,
          amount: tipAmount,
          imageId,
          txHash: tx.hash,
        }),
      });
      
      // Show success message
      alert(`Successfully tipped ${tipAmount} MOON to ${creatorName}!`);
      onClose();
    } catch (error) {
      console.error('Tipping failed:', error);
      alert('Failed to send tip. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const presetAmounts = ['5', '10', '25', '50', '100'];
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background-dark border border-background-light/20 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">
          Tip {creatorName} with MOON 🌙
        </h3>
        
        <div className="mb-6">
          <p className="text-sm text-foreground/70 mb-2">
            Your balance: {balance ? balance.formatted : '0'} MOON
          </p>
          
          {/* Preset amounts */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setTipAmount(amount)}
                className={`py-2 rounded-lg border transition ${
                  tipAmount === amount
                    ? 'border-primary bg-primary/20'
                    : 'border-background-light/20 hover:border-primary/50'
                }`}
              >
                {amount}
              </button>
            ))}
          </div>
          
          {/* Custom amount input */}
          <div className="relative">
            <input
              type="number"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 bg-background-dark border border-background-light/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min="0"
              step="0.1"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50">
              MOON
            </span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn btn-outline"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handleTip}
            className="flex-1 btn btn-primary"
            disabled={isProcessing || !tipAmount || parseFloat(tipAmount) <= 0}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Send ${tipAmount} MOON`
            )}
          </button>
        </div>
        
        {/* Info */}
        <p className="text-xs text-foreground/50 mt-4 text-center">
          Tips help support creators and the Moonbirds community
        </p>
      </div>
    </div>
  );
}