import { useTranslation } from "react-i18next";
import { useSearchParams, Link } from "react-router-dom";
import { useResetPassword, ResetPasswordForm } from "@/features/password-reset";
import { useNavigateWithLoading } from "@/shared/lib";
import { ROUTES } from "@/shared/config";

export const ResetPasswordPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigateWithLoading();
    const [searchParams] = useSearchParams();

    // Get email and token from URL query params
    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";

    const { form, onSubmit, isSubmitting } = useResetPassword({
        defaultEmail: email,
        defaultToken: token,
        onSuccess: () => {
            navigate(ROUTES.LOGIN);
        }
    });

    return (
        <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold text-foreground">
                        {t("password.resetTitle")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("password.resetDescription")}
                    </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <ResetPasswordForm
                        form={form}
                        isSubmitting={isSubmitting}
                        onSubmit={onSubmit}
                    />
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    {t("password.rememberPassword")}{" "}
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
