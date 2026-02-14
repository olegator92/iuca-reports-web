import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLogin, LoginForm } from "@/features/auth-login";
import { GoogleSignInButton } from "@/features/auth-google";
import { useNavigateWithLoading } from "@/shared/lib";
import { ROUTES } from "@/shared/config";

export const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigateWithLoading();

    const { form, onSubmit, isSubmitting } = useLogin({
        onSuccess: () => {
            navigate(ROUTES.HOME);
        },
        onEmailNotConfirmed: (email) => {
            navigate(`${ROUTES.REGISTER}?email=${encodeURIComponent(email)}&verified=false`);
        }
    });

    const handleGoogleSuccess = () => {
        navigate(ROUTES.HOME);
    };

    return (
        <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold text-foreground">
                        {t("auth.loginTitle")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("auth.loginDescription")}
                    </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <LoginForm
                        form={form}
                        isSubmitting={isSubmitting}
                        onSubmit={onSubmit}
                    />

                    <div className="mt-4 text-center">
                        <Link
                            to={ROUTES.FORGOT_PASSWORD}
                            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        >
                            {t("auth.forgotPassword")}
                        </Link>
                    </div>

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

                    <GoogleSignInButton
                        onSuccess={handleGoogleSuccess}
                        rememberMe={form.watch("rememberMe")}
                    />
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    {t("auth.noAccount")}{" "}
                    <Link
                        to={ROUTES.REGISTER}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        {t("auth.registerLink")}
                    </Link>
                </div>
            </div>
        </section>
    );
};
