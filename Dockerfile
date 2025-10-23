# Dockerfile for Gotenberg PDF Service
# This can be used for cloud deployment platforms like Railway, Render, etc.

FROM gotenberg/gotenberg:8

# Set environment variables
ENV CHROMIUM_DISABLE_WEB_SECURITY=true
ENV CHROMIUM_ALLOW_LIST=file:///tmp/.*
ENV GOTENBERG_LOG_LEVEL=info

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start Gotenberg
CMD ["gotenberg"]
