# Etapa de build
FROM node:18 AS build

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo package.json e o package-lock.json para o contêiner
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todos os arquivos do projeto para o contêiner
COPY . .

# Executa o build do aplicativo React
RUN npm run build

# Etapa de produção
FROM nginx:alpine

# Copia o build do React para o diretório padrão do nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia o arquivo de configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposição da porta padrão do nginx
EXPOSE 80

# Inicia o servidor nginx
CMD ["nginx", "-g", "daemon off;"]
