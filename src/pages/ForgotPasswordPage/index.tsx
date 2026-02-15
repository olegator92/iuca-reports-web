import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useForgotPassword, ForgotPasswordForm } from "@/features/password-forgot";
import { ROUTES } from "@/shared/config";

export const ForgotPasswordPage = () => {
    const { t } = useTranslation();

    const { form, onSubmit, isSubmitting } = useForgotPassword();

    return (
        <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold text-foreground">
                        {t("password.forgotTitle")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("password.forgotDescription")}
                    </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-6 shadow-sm lg:p-10">
                    <ForgotPasswordForm
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
