# BE-MisterioInFeliz

# Instalar os módulos e configurar as seguintes definições:

npm install express dotenv process | npm install --save-dev @types/express @types/node

# Definir Variáveis de ambiente:

JWT_SECRET --> Use o comando openssl rand -base64 32, padrão 'default' | PORT --> Defina a porta, padrão 3000

# Executar:

npx ts-node src/app.ts

# Login:

http://localhost:3000/api/login

# Registrar senha:

http://localhost:3000/api/register
