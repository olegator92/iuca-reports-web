import { create } from 'zustand';

interface NavigationLoadingState {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useNavigationLoadingStore = create<NavigationLoadingState>((set) => ({
    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),
}));
