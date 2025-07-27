#!/bin/bash

# Aguardar o Unit estar pronto
while ! curl -s http://localhost/config > /dev/null 2>&1; do
    echo "Aguardando Unit ficar pronto..."
    sleep 1
done

# Aplicar configuração
echo "Aplicando configuração do Unit..."
curl -X PUT --data-binary @/var/lib/unit/conf.json \
     --unix-socket /var/run/control.unit.sock \
     http://localhost/config

echo "Configuração aplicada com sucesso!"

# Manter o container rodando
tail -f /dev/null