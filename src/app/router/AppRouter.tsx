import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { HomePage } from '@/pages/HomePage';
import { TemplatesPage } from '@/pages/TemplatesPage';
import { TemplateEditPage } from '@/pages/TemplateUpdatePage';
import { RolesPage } from '@/pages/RolesPage';
import { UsersPage } from '@/pages/UsersPage';
import { DepartmentsPage } from '@/pages/DepartmentsPage';
import { PositionsPage } from '@/pages/PositionsPage';
import { DailyReportsPage } from '@/pages/DailyReportsPage';
import { WeeklyReportsPage } from '@/pages/WeeklyReportsPage';
import { LoginPage } from '@/pages/LoginPage';
// Password authentication is temporarily disabled (Google OAuth only)
// import { RegisterPage } from '@/pages/RegisterPage';
// import { VerifyEmailPage } from '@/pages/VerifyEmailPage';
import { ProfilePage } from '@/pages/ProfilePage';
// import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
// import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import { TermsOfUsePage } from '@/pages/TermsOfUsePage';
import { ForbiddenPage, NotFoundPage } from '@/pages/errors';
import { ROUTES } from '@/shared/config';
import { Route, Routes } from 'react-router-dom';
import { Loader, PageTransition } from '@/shared/ui';
import { useNavigationLoadingStore } from '@/shared/lib/stores/navigationLoadingStore';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';
import { PERMISSIONS } from '@/shared/lib';

export const AppRouter = () => {
    const { t } = useTranslation();
    const isNavigating = useNavigationLoadingStore((state) => state.isLoading);

    if (isNavigating) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader label={t('common.loading')} />
            </div>
        );
    }

    return (
        <Suspense
            fallback={
                <div className="flex min-h-[50vh] items-center justify-center">
                    <Loader label={t('common.loading')} />
                </div>
            }
        >
            <Routes>
                {/* Wrapper route for transitions */}
                <Route element={<PageTransition />}>
                    {/* Public routes */}
                    <Route path={ROUTES.HOME} element={<HomePage />} />

                    {/* Auth routes - redirect to home if already authenticated */}
                    <Route
                        path={ROUTES.LOGIN}
                        element={
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        }
                    />
                    {/* Password authentication is temporarily disabled (Google OAuth only)
                    <Route
                        path={ROUTES.REGISTER}
                        element={
                            <PublicRoute>
                                <RegisterPage />
                            </PublicRoute>
                        }
                    />

                    <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />

                    <Route
                        path={ROUTES.FORGOT_PASSWORD}
                        element={
                            <PublicRoute>
                                <ForgotPasswordPage />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path={ROUTES.RESET_PASSWORD}
                        element={
                            <PublicRoute>
                                <ResetPasswordPage />
                            </PublicRoute>
                        }
                    />
                    */}

                    {/* Protected routes - require authentication */}
                    <Route
                        path={ROUTES.PROFILE}
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.TEMPLATES}
                        element={
                            <ProtectedRoute requiredPermissions={[PERMISSIONS.TEMPLATE_VIEW]}>
                                <TemplatesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.TEMPLATE_EDIT}
                        element={
                            <ProtectedRoute requiredPermissions={[PERMISSIONS.TEMPLATE_EDIT]}>
                                <TemplateEditPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.ROLES}
                        element={
                            <ProtectedRoute requiredPermissions={[PERMISSIONS.ROLE_VIEW]}>
                                <RolesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.USERS}
                        element={
                            <ProtectedRoute requiredPermissions={[PERMISSIONS.USER_VIEW]}>
                                <UsersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.DEPARTMENTS}
                        element={
                            <ProtectedRoute requiredPermissions={[PERMISSIONS.DEPARTMENT_VIEW]}>
                                <DepartmentsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.POSITIONS}
                        element={
                            <ProtectedRoute requiredPermissions={[PERMISSIONS.POSITION_VIEW]}>
                                <PositionsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.DAILY_REPORTS}
                        element={
                            <ProtectedRoute requiredPermissions={[PERMISSIONS.DAILY_REPORT_VIEW]}>
                                <DailyReportsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.WEEKLY_REPORTS}
                        element={
                            <ProtectedRoute requiredPermissions={[PERMISSIONS.WEEKLY_REPORT_VIEW]}>
                                <WeeklyReportsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Legal pages - public */}
                    <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
                    <Route path={ROUTES.TERMS_OF_USE} element={<TermsOfUsePage />} />

                    {/* Error routes */}
                    <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
