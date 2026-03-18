#!/bin/bash

# Configuration
PROJECT_DIR="/var/www/cds"
STORAGE_DIR="$PROJECT_DIR/storage"
UPLOADS_DIR="$PROJECT_DIR/public/uploads"

echo "🚀 Iniciando configuração de diretórios no VPS..."

# 1. Create directories if they don't exist
echo "📂 Criando pastas de armazenamento..."
mkdir -p "$STORAGE_DIR/videos"
mkdir -p "$UPLOADS_DIR/images"

# 2. Set permissions (Adjust to your web user, usually www-data or the current user)
echo "🔐 Ajustando permissões..."
# Assuming the user running the app is 'root' or the current user
# If using Nginx/PM2 with a specific user, change this
chmod -R 775 "$STORAGE_DIR"
chmod -R 775 "$UPLOADS_DIR"

# 3. Inform about Nginx configuration (Optional but recommended)
echo "ℹ️ Dica: Para melhor desempenho, adicione isto ao seu arquivo de configuração do Nginx:"
echo ""
echo "location /uploads/ {"
echo "    alias $UPLOADS_DIR/;"
echo "    expires 30d;"
echo "    add_header Cache-Control \"public, no-transform\";"
echo "}"
echo ""

echo "✨ Configuração concluída de diretórios!"
