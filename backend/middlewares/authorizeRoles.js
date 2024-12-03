const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log("req.user:", req.user);
        if (!req.user || !req.user.role) {
            console.log("No user or user role found!");
            return res.status(403).json({ message: 'Forbidden: No user role found.' });
        }
        console.log("User role:", req.user.role);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: You do not have access to this resource. Your role: ${req.user.role}`,
            });
        }
        next();
    };
};

module.exports = authorizeRoles;
