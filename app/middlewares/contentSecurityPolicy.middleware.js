const contentSecurityPolicy = (req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; object-src *; frame-ancestors 'self';"
  );
  next();
};

module.exports = contentSecurityPolicy;
