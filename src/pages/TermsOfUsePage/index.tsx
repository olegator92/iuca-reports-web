import { useTranslation } from "react-i18next";

export const TermsOfUsePage = () => {
    const { t } = useTranslation();

    return (
        <section className="mx-auto w-full px-2 py-4 sm:p-6">
            <div className="space-y-6 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors sm:p-6">
                <div className="border-b border-border pb-4">
                    <h1 className="break-words text-2xl font-bold text-foreground sm:text-4xl">
                        {t("terms.title")}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {t("terms.lastUpdated")}
                    </p>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("terms.introduction.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("terms.introduction.content")}
                        </p>
                    </section>

                    {/* Acceptance of Terms */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("terms.acceptance.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("terms.acceptance.content")}
                        </p>
                    </section>

                    {/* User Accounts */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("terms.accounts.title")}
                        </h2>
                        <div className="mt-3 space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-foreground">
                                    {t("terms.accounts.registration.title")}
                                </h3>
                                <p className="mt-2 text-muted-foreground leading-relaxed">
                                    {t("terms.accounts.registration.content")}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground">
                                    {t("terms.accounts.security.title")}
                                </h3>
                                <p className="mt-2 text-muted-foreground leading-relaxed">
                                    {t("terms.accounts.security.content")}
                                </p>
                                <ul className="mt-2 ml-6 list-disc space-y-1 text-muted-foreground">
                                    <li>{t("terms.accounts.security.items.passwordRequirements")}</li>
                                    <li>{t("terms.accounts.security.items.confidentiality")}</li>
                                    <li>{t("terms.accounts.security.items.unauthorized")}</li>
                                    <li>{t("terms.accounts.security.items.liability")}</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground">
                                    {t("terms.accounts.emailVerification.title")}
                                </h3>
                                <p className="mt-2 text-muted-foreground leading-relaxed">
                                    {t("terms.accounts.emailVerification.content")}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* User Responsibilities */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("terms.responsibilities.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("terms.responsibilities.intro")}
                        </p>
                        <ul className="mt-3 ml-6 list-disc space-y-2 text-muted-foreground">
                            <li>{t("terms.responsibilities.items.accurate")}</li>
                            <li>{t("terms.responsibilities.items.lawful")}</li>
                            <li>{t("terms.responsibilities.items.noHarm")}</li>
                            <li>{t("terms.responsibilities.items.noImpersonation")}</li>
                            <li>{t("terms.responsibilities.items.noUnauthorized")}</li>
                            <li>{t("terms.responsibilities.items.respectRights")}</li>
                        </ul>
                    </section>

                    {/* Authentication & Sessions */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("terms.authentication.title")}
                        </h2>
                        <div className="mt-3 space-y-4">
                            <p className="text-muted-foreground leading-relaxed">
                                {t("terms.authentication.content")}
                            </p>
                            <div>
                                <h3 className="text-lg font-medium text-foreground">
                                    {t("terms.authentication.tokens.title")}
                                </h3>
                                <p className="mt-2 text-muted-foreground leading-relaxed">
                                    {t("terms.authentication.tokens.content")}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground">
                                    {t("terms.authentication.oauth.title")}
                                </h3>
                                <p className="mt-2 text-muted-foreground leading-relaxed">
                                    {t("terms.authentication.oauth.content")}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* File Uploads */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("terms.uploads.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("terms.uploads.content")}
                        </p>
                        <ul className="mt-3 ml-6 list-disc space-y-1 text-muted-foreground">
                            <li>{t("terms.uploads.items.fileTypes")}</li>
                            <li>{t("terms.uploads.items.maxSize")}</li>
                            <li>{t("terms.uploads.items.appropriate")}</li>
                            <li>{t("terms.uploads.items.rights")}</li>
                        </ul>
                    </section>

                    {/* Roles & Permissions */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("terms.rolesPermissions.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("terms.rolesPermissions.content")}
                        </p>
                    </section>

                    {/* Account Termination */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("terms.termination.title")}
                        </h2>
                        <div className="mt-3 space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-foreground">
                                    {t("terms.termination.byUser.title")}
                                </h3>
                                <p className="mt-2 text-muted-foreground leading-relaxed">
                                    {t("terms.termination.byUser.content")}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground">
                                    {t("terms.termination.byUs.title")}
                                </h3>
                                <p className="mt-2 text-muted-foreground leading-relaxed">
                                    {t("terms.termination.byUs.content")}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Intellectual Property */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("terms.intellectualProperty.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("terms.intellectualProperty.content")}
                        </p>
                    </section>

                    {/* Disclaimers */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("terms.disclaimers.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed uppercase font-medium">
                            {t("terms.disclaimers.asIs")}
                        </p>
                        <p className="mt-2 text-muted-foreground leading-relaxed">
                            {t("terms.disclaimers.content")}
                        </p>
                    </section>

                    {/* Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("terms.liability.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("terms.liability.content")}
                        </p>
                    </section>

                    {/* Modifications */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("terms.modifications.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("terms.modifications.content")}
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("terms.governingLaw.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("terms.governingLaw.content")}
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("terms.contact.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("terms.contact.content")}
                        </p>
                    </section>
                </div>
            </div>
        </section>
    );
};
