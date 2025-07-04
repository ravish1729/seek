import { useWriteContract, useReadContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { TIP_CONTRACT_ADDRESS } from '../lib/constants';
import { parseEther, formatEther } from 'ethers';
import { TIP_CONTRACT_ABI } from '../lib/tipABI';

export function useTip() {
    const publicClient = usePublicClient();
    
    // Write contract for sending tips
    const { 
        writeContract, 
        data: hash, 
        isPending: isSending,
        error: sendError 
    } = useWriteContract();

    // Read contract for platform fee percentage
    const { 
        data: platformFeeBps,
        isError: isPlatformFeeError,
        error: platformFeeError 
    } = useReadContract({
        address: TIP_CONTRACT_ADDRESS as `0x${string}`,
        abi: TIP_CONTRACT_ABI,
        functionName: 'getPlatformFeePercentage',
    });

    // Wait for transaction receipt
    const { 
        data: receipt, 
        isError: isReceiptError, 
        error: receiptError,
        isLoading: isWaitingForReceipt 
    } = useWaitForTransactionReceipt({
        hash,
    });

    // Calculate fee for a given amount
    const calculateFee = async (amount: string) => {
        if (!amount || parseFloat(amount) <= 0 || !publicClient) {
            return { fee: '0', netAmount: '0' };
        }

        try {
            const amountWei = parseEther(amount);
            
            const result = await publicClient.readContract({
                address: TIP_CONTRACT_ADDRESS as `0x${string}`,
                abi: TIP_CONTRACT_ABI,
                functionName: 'calculateFee',
                args: [amountWei],
            });
            
            if (result && Array.isArray(result)) {
                const [fee, netAmount] = result;
                return {
                    fee: formatEther(fee),
                    netAmount: formatEther(netAmount)
                };
            }
            return { fee: '0', netAmount: '0' };
        } catch (error) {
            console.error('Failed to calculate fee:', error);
            return { fee: '0', netAmount: '0' };
        }
    };

    // Send tip
    const sendTip = async (recipient: string, amount: string) => {
        if (!recipient || !amount || parseFloat(amount) <= 0) {
            throw new Error('Invalid recipient or amount');
        }

        const amountWei = parseEther(amount);
        
        writeContract({
            address: TIP_CONTRACT_ADDRESS as `0x${string}`,
            abi: TIP_CONTRACT_ABI,
            functionName: 'sendTip',
            args: [recipient as `0x${string}`],
            value: amountWei,
        });
    };

    // Get platform fee percentage
    const getPlatformFeePercentage = (): number => {
        if (platformFeeBps) {
            return Number(platformFeeBps) / 100; // Convert basis points to percentage
        }
        return 1; // Default to 1%
    };

    // Validation functions
    const validateAmount = (amount: string): boolean => {
        try {
            const num = parseFloat(amount);
            return num > 0 && !isNaN(num);
        } catch {
            return false;
        }
    };

    const validateAddress = (address: string): boolean => {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    return {
        // State
        hash,
        receipt,
        isSending,
        isWaitingForReceipt,
        isPlatformFeeError,
        isReceiptError,
        
        // Errors
        sendError,
        platformFeeError,
        receiptError,
        
        // Functions
        sendTip,
        calculateFee,
        getPlatformFeePercentage,
        validateAmount,
        validateAddress,
        
        // Computed values
        platformFeePercentage: getPlatformFeePercentage(),
        isTransactionSuccessful: receipt?.status === 'success',
    };
} 