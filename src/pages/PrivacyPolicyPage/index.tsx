import { useTranslation } from "react-i18next";

export const PrivacyPolicyPage = () => {
    const { t } = useTranslation();

    return (
        <section className="mx-auto w-full px-2 py-4 sm:p-6">
            <div className="space-y-6 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors sm:p-6">
                <div className="border-b border-border pb-4">
                    <h1 className="break-words text-2xl font-bold text-foreground sm:text-4xl">
                        {t("privacy.title")}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {t("privacy.lastUpdated")}
                    </p>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("privacy.introduction.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("privacy.introduction.content")}
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("privacy.informationCollected.title")}
                        </h2>
                        <div className="mt-3 space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-foreground">
                                    {t("privacy.informationCollected.accountInfo.title")}
                                </h3>
                                <p className="mt-2 text-muted-foreground leading-relaxed">
                                    {t("privacy.informationCollected.accountInfo.content")}
                                </p>
                                <ul className="mt-2 ml-6 list-disc space-y-1 text-muted-foreground">
                                    <li>{t("privacy.informationCollected.accountInfo.items.email")}</li>
                                    <li>{t("privacy.informationCollected.accountInfo.items.fullName")}</li>
                                    <li>{t("privacy.informationCollected.accountInfo.items.password")}</li>
                                    <li>{t("privacy.informationCollected.accountInfo.items.profilePhoto")}</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground">
                                    {t("privacy.informationCollected.authenticationData.title")}
                                </h3>
                                <p className="mt-2 text-muted-foreground leading-relaxed">
                                    {t("privacy.informationCollected.authenticationData.content")}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground">
                                    {t("privacy.informationCollected.usageData.title")}
                                </h3>
                                <p className="mt-2 text-muted-foreground leading-relaxed">
                                    {t("privacy.informationCollected.usageData.content")}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Your Information */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("privacy.howWeUse.title")}
                        </h2>
                        <ul className="mt-3 ml-6 list-disc space-y-2 text-muted-foreground">
                            <li>{t("privacy.howWeUse.items.provideServices")}</li>
                            <li>{t("privacy.howWeUse.items.authentication")}</li>
                            <li>{t("privacy.howWeUse.items.communication")}</li>
                            <li>{t("privacy.howWeUse.items.improve")}</li>
                            <li>{t("privacy.howWeUse.items.security")}</li>
                        </ul>
                    </section>

                    {/* Third-Party Services */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("privacy.thirdParty.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("privacy.thirdParty.content")}
                        </p>
                        <div className="mt-4">
                            <h3 className="text-lg font-medium text-foreground">
                                {t("privacy.thirdParty.google.title")}
                            </h3>
                            <p className="mt-2 text-muted-foreground leading-relaxed">
                                {t("privacy.thirdParty.google.content")}
                            </p>
                        </div>
                    </section>

                    {/* Data Storage */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("privacy.dataStorage.title")}
                        </h2>
                        <div className="mt-3 space-y-4">
                            <p className="text-muted-foreground leading-relaxed">
                                {t("privacy.dataStorage.content")}
                            </p>
                            <div>
                                <h3 className="text-lg font-medium text-foreground">
                                    {t("privacy.dataStorage.localStorage.title")}
                                </h3>
                                <p className="mt-2 text-muted-foreground leading-relaxed">
                                    {t("privacy.dataStorage.localStorage.content")}
                                </p>
                                <ul className="mt-2 ml-6 list-disc space-y-1 text-muted-foreground">
                                    <li>{t("privacy.dataStorage.localStorage.items.authTokens")}</li>
                                    <li>{t("privacy.dataStorage.localStorage.items.language")}</li>
                                    <li>{t("privacy.dataStorage.localStorage.items.theme")}</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Data Security */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("privacy.security.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("privacy.security.content")}
                        </p>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("privacy.yourRights.title")}
                        </h2>
                        <ul className="mt-3 ml-6 list-disc space-y-2 text-muted-foreground">
                            <li>{t("privacy.yourRights.items.access")}</li>
                            <li>{t("privacy.yourRights.items.correction")}</li>
                            <li>{t("privacy.yourRights.items.deletion")}</li>
                            <li>{t("privacy.yourRights.items.withdraw")}</li>
                            <li>{t("privacy.yourRights.items.portability")}</li>
                        </ul>
                    </section>

                    {/* Data Retention */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("privacy.retention.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("privacy.retention.content")}
                        </p>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("privacy.children.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("privacy.children.content")}
                        </p>
                    </section>

                    {/* International Data Transfers */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("privacy.international.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("privacy.international.content")}
                        </p>
                    </section>

                    {/* Changes to Privacy Policy */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("privacy.changes.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("privacy.changes.content")}
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {t("privacy.contact.title")}
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {t("privacy.contact.content")}
                        </p>
                    </section>
                </div>
            </div>
        </section>
    );
};
