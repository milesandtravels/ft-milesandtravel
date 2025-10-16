# Etapa 1: Build
FROM node:latest AS build-stage

WORKDIR /app

# Copia arquivos essenciais primeiro para aproveitar cache
COPY package.json yarn.lock .
# Instala Yarn apenas se não existir, e então instala dependências com lockfile
RUN if command -v yarn >/dev/null 2>&1; then \
      echo "Yarn já instalado"; \
    else \
      npm install -g yarn; \
    fi \
    && yarn --version \
    && yarn install --frozen-lockfile

# Copia o restante do projeto
COPY . .

# Define ambiente para produção e faz o build
ENV NODE_ENV=production  
RUN yarn generate

# Etapa 2: Servidor de produção
FROM nginx:stable-alpine AS production-stage

# Remove config padrão e adiciona a nossa
RUN rm /etc/nginx/conf.d/default.conf  
COPY nginx.conf /etc/nginx/conf.d

# Copia os arquivos estáticos
COPY --from=build-stage /app/.output/public /usr/share/nginx/html

EXPOSE 80  
CMD ["nginx", "-g", "daemon off;"]