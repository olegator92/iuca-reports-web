import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { useRegister, RegisterForm } from "@/features/auth-register";
import { useResendEmailConfirmationMutation } from "@/entities/auth";
import { GoogleSignInButton } from "@/features/auth-google";
import { useNavigateWithLoading } from "@/shared/lib";
import { ROUTES } from "@/shared/config";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";

export const RegisterPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigateWithLoading();
    const [searchParams] = useSearchParams();
    const [registrationSuccess, setRegistrationSuccess] = useState<{
        email: string;
        message: string;
    } | null>(null);
    const [resendEmailConfirmation, { isLoading: isResending }] = useResendEmailConfirmationMutation();
    const [resendSuccess, setResendSuccess] = useState(false);

    // Check if redirected from login with unverified email
    useEffect(() => {
        const email = searchParams.get("email");
        const verified = searchParams.get("verified");

        if (email && verified === "false") {
            setRegistrationSuccess({
                email,
                message: t("auth.emailNotVerifiedMessage")
            });
        }
    }, [searchParams, t]);

    const { form, onSubmit, isSubmitting } = useRegister({
        onSuccess: (email, message) => {
            setRegistrationSuccess({ email, message });
        }
    });

    const handleGoogleSuccess = () => {
        navigate(ROUTES.HOME);
    };

    const handleResendEmail = async () => {
        if (!registrationSuccess?.email) return;

        try {
            await resendEmailConfirmation({ email: registrationSuccess.email }).unwrap();
            setResendSuccess(true);
            setTimeout(() => setResendSuccess(false), 5000); // Hide after 5 seconds
        } catch {
            // Error handled by global error handler
        }
    };

    // Show success message after registration
    if (registrationSuccess) {
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
                                {t("auth.registrationSuccessTitle")}
                            </h1>
                            <p className="text-muted-foreground">
                                {registrationSuccess.message}
                            </p>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{registrationSuccess.email}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t("auth.checkEmailInstruction")}
                            </p>
                        </div>

                        {resendSuccess && (
                            <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3">
                                <p className="text-sm text-green-800 dark:text-green-200">
                                    {t("auth.emailResent")}
                                </p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <Link
                                to={ROUTES.LOGIN}
                                className="block w-full rounded-md bg-brand px-4 py-3 md:py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90 transition-colors min-h-[48px] md:min-h-0"
                            >
                                {t("auth.goToLogin")}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                                {t("auth.emailNotReceived")}{" "}
                                <button
                                    onClick={handleResendEmail}
                                    disabled={isResending}
                                    className="text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                                >
                                    {isResending && <Loader2 className="h-3 w-3 animate-spin" />}
                                    {t("auth.resendEmail")}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Show registration form
    return (
        <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold text-foreground">
                        {t("auth.registerTitle")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("auth.registerDescription")}
                    </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-6 shadow-sm lg:p-10">
                    <GoogleSignInButton
                        onSuccess={handleGoogleSuccess}
                    />

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                {t("auth.orContinueWith")}
                            </span>
                        </div>
                    </div>

                    <RegisterForm
                        form={form}
                        isSubmitting={isSubmitting}
                        onSubmit={onSubmit}
                    />
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    {t("auth.hasAccount")}{" "}
                    <Link
                        to={ROUTES.LOGIN}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        {t("auth.loginLink")}
                    </Link>
                </div>
            </div>
        </section>
    );
};
