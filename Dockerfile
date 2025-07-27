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

# Criar configuração do nginx unit
RUN echo '{
    "listeners": {
        "*:3000": {
            "pass": "routes"
        }
    },
    "routes": [
        {
            "match": {
                "uri": "~\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$"
            },
            "action": {
                "share": "/var/www/html$uri",
                "fallback": {
                    "pass": "applications/spa"
                }
            }
        },
        {
            "action": {
                "share": "/var/www/html$uri",
                "fallback": {
                    "share": "/var/www/html/index.html"
                }
            }
        }
    ]
}' > /docker-entrypoint.d/config.json

# Definir permissões corretas
RUN chown -R unit:unit /var/www/html

# Expor porta
EXPOSE 3000

# Comando padrão
CMD ["unitd", "--no-daemon", "--control", "unix:/var/run/control.unit.sock"]