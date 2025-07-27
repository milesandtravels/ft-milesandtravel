# Etapa 1: Build
FROM node:latest AS build-stage

WORKDIR /app

# Copia arquivos essenciais primeiro para aproveitar cache
COPY package.json yarn.lock .  
RUN corepack enable && corepack prepare yarn@stable --activate  
RUN yarn install --frozen-lockfile

# Copia o restante do projeto
COPY . .

# Define ambiente para produção e faz o build
ENV NODE_ENV=production  
RUN yarn generate

# Etapa 2: Servidor de produção
FROM nginx:stable-alpine AS production-stage

# Segurança: não expõe versão do Nginx
RUN echo "server_tokens off;" >> /etc/nginx/nginx.conf

# Remove config padrão e adiciona a nossa
RUN rm /etc/nginx/conf.d/default.conf  
COPY nginx.conf /etc/nginx/conf.d

# Copia os arquivos estáticos
COPY --from=build-stage /app/.output/public /usr/share/nginx/html

EXPOSE 80  
CMD ["nginx", "-g", "daemon off;"]