import {
    Component,
    type ComponentType,
    type ErrorInfo,
    type ReactNode,
    useCallback,
} from "react";
import { ServerErrorPage } from "@/pages/errors";
import { ROUTES } from "@/shared/config";
import { useNavigateWithLoading } from "@/shared/lib";

type FallbackProps = {
    error: Error;
    resetError: () => void;
};

type ErrorBoundaryProps = {
    children: ReactNode;
    FallbackComponent: ComponentType<FallbackProps>;
};

type ErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("Unhandled UI error", error, info);
    }

    private readonly resetErrorBoundary = () => {
        this.setState({ hasError: false, error: null });
    };

    public render(): ReactNode {
        if (this.state.hasError && this.state.error) {
            const { FallbackComponent } = this.props;
            return (
                <FallbackComponent
                    error={this.state.error}
                    resetError={this.resetErrorBoundary}
                />
            );
        }

        return this.props.children;
    }
}

const ServerErrorFallback = ({ resetError }: FallbackProps) => {
    const navigate = useNavigateWithLoading();

    const handleGoHome = useCallback(() => {
        resetError();
        navigate(ROUTES.HOME);
    }, [navigate, resetError]);

    const handleReload = useCallback(() => {
        resetError();
        window.location.reload();
    }, [resetError]);

    return (
        <ServerErrorPage
            onGoHome={handleGoHome}
            onReload={handleReload}
        />
    );
};

export const ErrorBoundaryProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ErrorBoundary FallbackComponent={ServerErrorFallback}>
            {children}
        </ErrorBoundary>
    );
};
