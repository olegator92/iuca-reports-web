import { useCurrentUser } from "@/shared/lib/auth";

/**
 * Development tool to debug user permissions
 * Add this component temporarily to any page to see the user's permissions
 *
 * Usage:
 * import { PermissionDebugger } from "@/shared/ui/PermissionDebugger";
 *
 * Then add <PermissionDebugger /> in your component
 */
export const PermissionDebugger = () => {
    const user = useCurrentUser();

    if (!user) {
        return (
            <div className="fixed bottom-4 right-4 max-w-md rounded-lg border border-yellow-500 bg-yellow-50 p-4 text-sm dark:bg-yellow-950">
                <h3 className="font-bold text-yellow-800 dark:text-yellow-200">
                    Permission Debugger
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300">No user logged in</p>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 max-w-md rounded-lg border border-blue-500 bg-blue-50 p-4 text-sm dark:bg-blue-950">
            <h3 className="mb-2 font-bold text-blue-800 dark:text-blue-200">
                Permission Debugger
            </h3>
            <div className="space-y-2 text-blue-700 dark:text-blue-300">
                <div>
                    <strong>User:</strong> {user.name} ({user.email})
                </div>
                <div>
                    <strong>Roles:</strong> {user.roles.join(", ") || "None"}
                </div>
                <div>
                    <strong>Permissions loaded:</strong>{" "}
                    {user.permissions ? "Yes" : "No (using role-based fallback)"}
                </div>
                {user.permissions && (
                    <div>
                        <strong>Permissions:</strong>
                        <ul className="ml-4 mt-1 list-disc">
                            {user.permissions.map((p) => (
                                <li key={p}>
                                    {p}
                                    {p === "*" && (
                                        <span className="ml-2 font-bold text-green-600 dark:text-green-400">
                                            (WILDCARD - Full Access)
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
