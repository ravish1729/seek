import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useCallback } from 'react';

export function useWallet() {
    const { address, isConnected } = useAccount();
    const { connect, connectors, isPending } = useConnect();
    const { disconnect } = useDisconnect();

    const handleConnect = useCallback(async () => {
        if (connectors.length > 0) {
            connect({ connector: connectors[0] });
        }
    }, [connect, connectors]);

    const handleDisconnect = useCallback(() => {
        // Clear localStorage when disconnecting
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
        disconnect();
    }, [disconnect]);

    return {
        address: address || null,
        isConnecting: isPending,
        isConnected,
        error: null, // Rainbow Kit handles errors internally
        connect: handleConnect,
        disconnect: handleDisconnect,
    };
} 