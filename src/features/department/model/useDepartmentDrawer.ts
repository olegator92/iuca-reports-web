import { useState, useCallback } from "react";
import type { Department } from "@/entities/department/model";

type DrawerMode = "create" | "edit" | "view";

interface DepartmentDrawerState {
    isOpen: boolean;
    mode: DrawerMode;
    department: Department | null;
}

export const useDepartmentDrawer = () => {
    const [state, setState] = useState<DepartmentDrawerState>({
        isOpen: false,
        mode: "create",
        department: null
    });

    const openCreate = useCallback(() => {
        setState({ isOpen: true, mode: "create", department: null });
    }, []);

    const openEdit = useCallback((department: Department) => {
        setState({ isOpen: true, mode: "edit", department });
    }, []);

    const openView = useCallback((department: Department) => {
        setState({ isOpen: true, mode: "view", department });
    }, []);

    const close = useCallback(() => {
        setState((prev) => ({ ...prev, isOpen: false }));
        // Clear department after animation
        setTimeout(() => {
            setState((prev) => (prev.isOpen ? prev : { isOpen: false, mode: "create", department: null }));
        }, 300);
    }, []);

    return {
        isOpen: state.isOpen,
        mode: state.mode,
        department: state.department,
        openCreate,
        openEdit,
        openView,
        close
    };
};
