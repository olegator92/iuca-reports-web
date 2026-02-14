import { useCallback } from 'react';
import { useNavigate, type NavigateOptions } from 'react-router-dom';
import { useNavigationLoadingStore } from '../stores/navigationLoadingStore';

export const useNavigateWithLoading = () => {
    const navigate = useNavigate();
    const { setLoading } = useNavigationLoadingStore();

    const navigateWithLoading = useCallback(
        (to: string | number, options?: NavigateOptions) => {
            setLoading(true);

            // Use requestAnimationFrame to ensure loading state is set before navigation
            requestAnimationFrame(() => {
                if (typeof to === 'number') {
                    navigate(to);
                } else {
                    navigate(to, options);
                }

                // Reset loading state after a brief delay
                setTimeout(() => {
                    setLoading(false);
                }, 150);
            });
        },
        [navigate, setLoading]
    );

    return navigateWithLoading;
};
