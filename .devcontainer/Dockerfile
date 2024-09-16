FROM node:20.10.0-bullseye-slim

ARG USERNAME=vscode
ARG USERID=1000

RUN set -ex \
    && apt-get update \
    && apt-get install -y \
        sudo \
        ca-certificates \
        --no-install-recommends \
    # Delete node user with uid=1000 and create vscode user with uid=1000
    && userdel -r node \
    && groupadd --gid ${USERID} ${USERNAME} \
    && useradd -s /bin/bash --uid ${USERID} --gid ${USERID} -m ${USERNAME} \
    && echo ${USERNAME} ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/${USERNAME} \
    && chmod 0440 /etc/sudoers.d/${USERNAME} \
    && npm install -g pnpm \
    && rm -rf /var/lib/apt/lists/*

USER ${USERNAME}
