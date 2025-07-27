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

# Copiar arquivos estáticos
COPY --from=builder /app/.output/public /usr/share/unit/welcome/

# Expor porta
EXPOSE 8080