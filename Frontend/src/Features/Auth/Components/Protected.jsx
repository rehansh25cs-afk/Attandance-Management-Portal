import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { useAuth } from "../Hooks/useAuth";

const getAccountType = (user) =>
    user?.permissions?.toLowerCase() || user?.role?.toLowerCase();

const hasPermission = (user, requiredPermission) => {
    const accountTypes = [user?.permissions, user?.role]
        .filter(Boolean)
        .map((value) => value.toLowerCase());

    if (requiredPermission === "admin") {
        return accountTypes.some((type) => type === "admin" || type === "superadmin");
    }

    return accountTypes.includes(requiredPermission);
};

const getDashboardPath = (user) => {
    const accountType = getAccountType(user);

    if (accountType === "admin" || accountType === "superadmin") {
        return "/admin/dashboard";
    }

    if (accountType === "candidate") {
        return "/candidate/dashboard";
    }

    return "/";
};

const Protected = ({ children, permissions = "candidate" }) => {
    const user = useSelector((state) => state.auth.user);
    const { handleGetMe } = useAuth();
    const [checkingSession, setCheckingSession] = useState(!user);

    useEffect(() => {
        if (!checkingSession) {
            return undefined;
        }

        let isMounted = true;

        const checkSession = async () => {
            try {
                await handleGetMe();
            } catch {
                // An invalid or expired session is handled below by the redirect.
            } finally {
                if (isMounted) {
                    setCheckingSession(false);
                }
            }
        };

        checkSession();

        return () => {
            isMounted = false;
        };
    }, [checkingSession, handleGetMe]);

    if (checkingSession) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
                Checking your session...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!hasPermission(user, permissions)) {
        return <Navigate to={getDashboardPath(user)} replace />;
    }

    return children;
};

export default Protected;
