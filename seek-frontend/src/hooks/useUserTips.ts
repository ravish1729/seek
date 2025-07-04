import { useState, useEffect } from 'react';
import { useContractRead } from 'wagmi';
import { useWallet } from './useWallet';
import { TIP_CONTRACT_ADDRESS } from '../lib/constants';
import { TIP_CONTRACT_ABI } from '../lib/tipABI';

export function useUserTips() {
    const { address } = useWallet();
    const [tips, setTips] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch total tips received by the current user
    const { data: totalTipsReceived, isLoading: isLoadingTips } = useContractRead({
        address: TIP_CONTRACT_ADDRESS,
        abi: TIP_CONTRACT_ABI,
        functionName: 'getTotalTipsReceived',
        args: address ? [address] : undefined,
    });

    useEffect(() => {
        if (address && totalTipsReceived !== undefined) {
            // Convert from wei to FIL (assuming 18 decimals)
            setTips(Number(totalTipsReceived) / 1e18);
            setLoading(false);
        } else if (!address) {
            setTips(null);
            setLoading(false);
        }
    }, [address, totalTipsReceived]);

    return {
        tips,
        loading: loading || isLoadingTips,
    };
} 