#!/bin/zsh

# Setup .zshrc
cp -f .devcontainer/shell/config/.zshrc ~/.zshrc
sudo chown -R vscode node_modules
echo "Setup completed."
