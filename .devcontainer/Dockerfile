# ARG declarations for Node.js and Alpine versions
ARG NODE_VERSION=20
ARG ALPINE_VERSION=3.19

# Stage 1: Node.js image
FROM node:${NODE_VERSION}-alpine AS node

# Stage 2: Final image
FROM alpine:${ALPINE_VERSION}

# LABEL declarations
LABEL version="1.0" description="Alpine Node" maintainer="dak2"

# ARG declarations
ARG USERNAME=vscode
ARG USERID=1000

# Copy Node.js from the node image
# ref. https://stackoverflow.com/a/76132347
COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

# Install packages and create non-root user
RUN set -ex \
    && apk update \
    && apk add --no-cache \
        sudo \
        ca-certificates \
    && addgroup -g ${USERID} ${USERNAME} \
    && adduser -s /bin/ash -u ${USERID} -G ${USERNAME} -h /home/${USERNAME} -D ${USERNAME} \
    && echo "${USERNAME} ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/${USERNAME} \
    && chmod 0440 /etc/sudoers.d/${USERNAME} \
    && npm install -g pnpm \
    && rm -rf /var/cache/apk/*

# Switch to non-root user
USER ${USERNAME}

# Set working directory
WORKDIR /home/${USERNAME}
