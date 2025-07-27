# Etapa 1: Build
FROM node:latest AS build-stage

WORKDIR /app
COPY . .

# Instala o Yarn globalmente
RUN corepack enable && corepack prepare yarn@stable --activate

# Instala as dependências com Yarn
RUN yarn install

# Build do projeto Nuxt com SSR desabilitado
RUN yarn generate

# Etapa 2: Servidor de produção
FROM nginx:stable-alpine AS production-stage

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d

# Copia os arquivos estáticos gerados pelo Nuxt
COPY --from=build-stage /app/.output/public /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]