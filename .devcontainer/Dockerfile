# ARG declarations for Node.js version
ARG NODE_VERSION=22.9

# Stage 1: Node.js image
FROM node:${NODE_VERSION}-bookworm-slim AS node

# Stage 2: Final image
FROM debian:bookworm-slim

# LABEL declarations
LABEL version="1.0" description="Ubuntu Node" maintainer="dak2"

# ARG declarations
ARG USERNAME=vscode
ARG USERID=1000

# Copy Node.js from the node image
COPY --from=node /usr/local /usr/local
COPY --from=node /usr/lib /usr/lib

# Install packages and create non-root user
RUN set -ex \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        sudo \
        ca-certificates \
        git \
    && groupadd --gid ${USERID} ${USERNAME} \
    && useradd --uid ${USERID} --gid ${USERID} -m ${USERNAME} \
    && echo ${USERNAME} ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/${USERNAME} \
    && chmod 0440 /etc/sudoers.d/${USERNAME} \
    && npm install -g pnpm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set Node.js environment variables
ENV NODE_PATH=/usr/local/lib/node_modules
ENV NPM_CONFIG_PREFIX=/home/${USERNAME}/.npm-global
ENV PATH=$NPM_CONFIG_PREFIX/bin:$PATH

# Switch to non-root user
USER ${USERNAME}

# Set working directory
WORKDIR /home/${USERNAME}
