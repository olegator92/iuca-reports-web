import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { useVerifyEmailMutation } from "@/entities/auth";
import { ROUTES } from "@/shared/config";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export const VerifyEmailPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
    const [verificationState, setVerificationState] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const hasVerified = useRef(false);

    useEffect(() => {
        // Prevent duplicate verification attempts
        if (hasVerified.current) {
            return;
        }

        const token = searchParams.get("token");
        const email = searchParams.get("email");

        if (!token) {
            setVerificationState("error");
            setErrorMessage(t("auth.verifyEmailTokenMissing"));
            return;
        }

        if (!email) {
            setVerificationState("error");
            setErrorMessage(t("auth.verifyEmailEmailMissing"));
            return;
        }

        // Mark as verified to prevent duplicate calls
        hasVerified.current = true;

        // Call verification API
        verifyEmail({ email, token })
            .unwrap()
            .then(() => {
                setVerificationState("success");
            })
            .catch((error: unknown) => {
                setVerificationState("error");
                setErrorMessage(
                    (error as { data?: { message?: string } })?.data?.message ||
                    t("auth.verifyEmailFailed")
                );
            });
    }, [searchParams, verifyEmail, t]);

    if (verificationState === "loading" || isLoading) {
        return (
            <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
                <div className="w-full max-w-md space-y-6">
                    <div className="rounded-lg border border-border bg-card p-8 shadow-sm text-center space-y-6 lg:p-10">
                        <div className="flex justify-center">
                            <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-foreground">
                                {t("auth.verifyingEmail")}
                            </h1>
                            <p className="text-muted-foreground">
                                {t("auth.verifyingEmailDescription")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (verificationState === "success") {
        return (
            <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
                <div className="w-full max-w-md space-y-6">
                    <div className="rounded-lg border border-border bg-card p-8 shadow-sm text-center space-y-6 lg:p-10">
                        <div className="flex justify-center">
                            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-foreground">
                                {t("auth.verifyEmailSuccess")}
                            </h1>
                            <p className="text-muted-foreground">
                                {t("auth.verifyEmailSuccessDescription")}
                            </p>
                        </div>

                        <Link
                            to={ROUTES.LOGIN}
                            className="block w-full rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90 transition-colors"
                        >
                            {t("auth.goToLogin")}
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    return (
        <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6">
                <div className="rounded-lg border border-border bg-card p-8 shadow-sm text-center space-y-6 lg:p-10">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
                            <XCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-foreground">
                            {t("auth.verifyEmailError")}
                        </h1>
                        <p className="text-muted-foreground">
                            {errorMessage}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Link
                            to={ROUTES.LOGIN}
                            className="block w-full rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90 transition-colors"
                        >
                            {t("auth.goToLogin")}
                        </Link>
                        <Link
                            to={ROUTES.REGISTER}
                            className="block w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {t("auth.backToRegister")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
