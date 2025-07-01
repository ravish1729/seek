import { useCallback, useState, useEffect } from 'react';
import { useSignMessage } from 'wagmi';
import axios from 'axios';
import { backendUrl } from '../lib/constants';
import { toast } from 'sonner';

export function useAuth() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { signMessageAsync } = useSignMessage();

    // Check if user is authenticated on mount
    const checkAuthStatus = useCallback(() => {
        if (typeof window === 'undefined') return false;
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    }, []);

    // Get auth message from backend
    const getAuthMessage = useCallback(async (address: string) => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/auth/get_auth_message`, {
                params: { publicKey: address },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data.value;
        } catch (error) {
            throw new Error('Failed to get authentication message');
        }
    }, []);

    // Verify signature with backend
    const verifySignature = useCallback(async (address: string, message: string, signature: string) => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/auth/verify_signature`, {
                params: {
                    publicKey: address,
                    signature,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            console.log("response", response);
            return response.data.value.access_token;
        } catch (error) {
            console.error('Error verifying signature:', error);
            throw new Error('Failed to verify signature');
        }
    }, []);

    // Complete authentication flow
    const authenticate = useCallback(async (address: string) => {
        if (!address) {
            throw new Error('Wallet address is required');
        }

        setIsAuthenticating(true);
        try {
            const message = await getAuthMessage(address);
            const signature = await signMessageAsync({ message });
            const accessToken = await verifySignature(address, message, signature);
            localStorage.setItem('access_token', accessToken);
            setIsAuthenticated(true);
            
            toast.success('Successfully authenticated');
            return accessToken;
        } catch (error) {
            toast.error('Authentication failed. Please try again.');
            throw error;
        } finally {
            setIsAuthenticating(false);
        }
    }, [getAuthMessage, signMessageAsync, verifySignature]);

    // Logout function
    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
        toast.success('Logged out successfully');
    }, []);

    // Initialize auth status
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    return {
        authenticate,
        logout,
        isAuthenticating,
        isAuthenticated,
        checkAuthStatus,
    };
}
