import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../lib/constants';
import { useAuth } from '../contexts/AuthContext';

export const useUserPoints = () => {
    const [points, setPoints] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();

    const fetchPoints = async () => {
        if (!isAuthenticated) {
            setPoints(null);
            return;
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
            setPoints(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${backendUrl}/api/v1/user/get_profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const userPoints = response.data.value.points;
            setPoints(userPoints);
        } catch (err) {
            console.error('Error fetching user points:', err);
            setError('Failed to fetch points');
            setPoints(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoints();
    }, [isAuthenticated]);

    return { points, loading, error, refetch: fetchPoints };
}; 