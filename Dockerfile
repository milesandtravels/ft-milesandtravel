# Multi-stage build para otimizar o tamanho da imagem final
FROM node:latest AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Gerar build estático
RUN yarn generate

# Estágio final com nginx unit
FROM nginx/unit:latest

# Copiar arquivos gerados do estágio anterior
COPY --from=builder /app/.output/public /var/www/html

# Copiar configuração e script de inicialização
COPY nginx-unit-config.json /var/lib/unit/conf.json
COPY init-unit.sh /usr/local/bin/init-unit.sh
RUN chmod +x /usr/local/bin/init-unit.sh

# Instalar curl para configuração via API
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Expor porta
EXPOSE 3000

# Comando para iniciar Unit em background e aplicar configuração
CMD ["sh", "-c", "unitd --no-daemon --control unix:/var/run/control.unit.sock & /usr/local/bin/init-unit.sh"]