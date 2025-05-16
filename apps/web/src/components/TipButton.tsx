import { useState } from 'react';
import { useAccount } from 'wagmi';
import TippingModal from './TippingModal';

interface TipButtonProps {
  recipientAddress: string;
  imageId: string;
  creatorName?: string;
  className?: string;
}

export default function TipButton({
  recipientAddress,
  imageId,
  creatorName,
  className = '',
}: TipButtonProps) {
  const { isConnected } = useAccount();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (!isConnected) {
      alert('Please connect your wallet to send tips');
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`btn btn-outline flex items-center gap-2 ${className}`}
      >
        <span>🌙</span>
        <span>Tip MOON</span>
      </button>
      
      <TippingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        recipientAddress={recipientAddress}
        imageId={imageId}
        creatorName={creatorName}
      />
    </>
  );
}