import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useSignMessage } from 'wagmi';
import axios from 'axios';
import { backendUrl } from '../lib/constants';
import { toast } from 'sonner';

interface AuthContextType {
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    authenticate: (address: string) => Promise<string>;
    logout: () => void;
    checkAuthStatus: () => boolean;
    validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { signMessageAsync } = useSignMessage();
    const { address, isConnected } = useAccount();
    const hasAttemptedAuth = useRef(false);

    // Check if user is authenticated on mount
    const checkAuthStatus = useCallback(() => {
        if (typeof window === 'undefined') return false;
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsAuthenticated(true);
            return true;
        }
        setIsAuthenticated(false);
        return false;
    }, []);

    // Validate existing token with backend
    const validateToken = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setIsAuthenticated(false);
            return false;
        }

        try {
            // You can add a token validation endpoint here if needed
            // For now, we'll just check if the token exists
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            // If token validation fails, clear it
            localStorage.removeItem('access_token');
            setIsAuthenticated(false);
            return false;
        }
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

    // Initialize auth status on mount
    useEffect(() => {
        validateToken();
    }, [validateToken]);

    // Handle wallet connection and authentication
    useEffect(() => {
        if (isConnected && address && !isAuthenticated && !isAuthenticating && !hasAttemptedAuth.current) {
            hasAttemptedAuth.current = true;
            authenticate(address).catch((error) => {
                console.error('Authentication failed after wallet connection:', error);
                hasAttemptedAuth.current = false; // Reset on failure to allow retry
            });
        }
    }, [isConnected, address, isAuthenticated, isAuthenticating, authenticate]);

    // Reset auth attempt flag when wallet disconnects
    useEffect(() => {
        if (!isConnected) {
            hasAttemptedAuth.current = false;
        }
    }, [isConnected]);

    // Clear localStorage when wallet disconnects
    useEffect(() => {
        if (!isConnected && isAuthenticated) {
            logout();
        }
    }, [isConnected, isAuthenticated, logout]);

    const value = {
        isAuthenticated,
        isAuthenticating,
        authenticate,
        logout,
        checkAuthStatus,
        validateToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 