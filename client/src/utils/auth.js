const dashboardByRole = {
  USER: "/user-dashboard",
  OWNER: "/owner-dashboard",
  ADMIN: "/admin-dashboard"
};

export const getStoredUser = () => {
  try {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      return null;
    }

    const user = JSON.parse(storedUser);

    if (!user || typeof user !== "object" || !dashboardByRole[user.role]) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
};

export const getDashboardPath = (role) => dashboardByRole[role];
