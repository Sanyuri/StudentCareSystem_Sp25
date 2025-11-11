# Base stage: Use a slim Node.js image
FROM node:23-alpine3.20 AS base

# Define environment variables
ENV DOCKER_WORKDIR="/app" \
    NODE_ENV="production" \
    PORT="3000"

EXPOSE ${PORT}

# Create a non-root user and set working directory
RUN mkdir -p ${DOCKER_WORKDIR} && addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR ${DOCKER_WORKDIR}

# Dependency installation stage: Install dependencies separately for caching benefits
FROM base AS dependencies

# Copy package files
COPY package.json  ./

# Install only production dependencies (skip devDependencies)
RUN npm install --frozen-lockfile --include=dev --non-interactive

# Build stage: Install application and build assets
FROM base AS build

# Copy application source code
COPY . .

# Copy node_modules from the dependency stage
COPY --from=dependencies ${DOCKER_WORKDIR}/node_modules ./node_modules

# Build the application
RUN npm run build

# Production stage: Set up the final production image
FROM base AS production

# Copy build output and necessary files from build stage
COPY --from=build ${DOCKER_WORKDIR}/build ./build
COPY --from=build ${DOCKER_WORKDIR}/server ./server
COPY --from=build ${DOCKER_WORKDIR}/package.json ./package.json
COPY --from=build ${DOCKER_WORKDIR}/node_modules ./node_modules
COPY --from=build ${DOCKER_WORKDIR}/tsconfig.json ./tsconfig.json
COPY --from=build ${DOCKER_WORKDIR}/ecosystem.config.cjs ./ecosystem.config.cjs

# Prune devDependencies to reduce image size and install pm2 globally for process management
RUN npm prune --omit=dev && npm install pm2 -g

RUN mkdir -p ./uploads && chown -R appuser:appgroup ./uploads

# Use the non-root user for security
USER appuser

# Default command to run the app with pm2
CMD ["pm2-runtime", "ecosystem.config.cjs"]
