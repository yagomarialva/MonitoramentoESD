# Sistema de Gestão de Monitores ESD

Este projeto é um sistema para testes ESD, com gerenciamento de **linhas**, **estações** e **monitores**, integrando também componentes físicos como **pulseiras** e **jigs** com microcontroladores.

---

## Estrutura do Projeto

O projeto está organizado nas seguintes pastas principais:

### Backend (`.\backend`)
Contém a API desenvolvida em C# para gerenciar os dados e a lógica do sistema.

- **`Controllers`**: Controladores responsáveis por expor os endpoints da API.
- **`Models`**: Modelos de dados que representam as tabelas do banco de dados.
- **`Repositories`**: Implementações para acesso ao banco de dados.
- **`Services`**: Camada de lógica de negócios.
- **`Hubs`**: Configuração do SignalR para comunicação em tempo real.
- **`Middleware`**: Configurações de middlewares personalizados.
- **`SwaggerSettings`**: Configuração do Swagger para documentação da API.

### Frontend (`.\frontend`)
Contém a interface do usuário desenvolvida em React.

- **`src/components`**: Componentes reutilizáveis, como tabelas, formulários e modais.
  - **`ESD`**: Componentes específicos para o gerenciamento de monitores, jigs, estações e operadores.
- **`src/pages`**: Páginas principais do sistema.
  - **`DashboardPage`**: Página inicial do sistema.
  - **`ESD`**: Páginas relacionadas ao gerenciamento de monitores e estações.
  - **`LoginPage`**: Página de login.
  - **`SignUpPage`**: Página de cadastro de usuários.
- **`src/api`**: Configuração das chamadas à API.
- **`src/context`**: Gerenciamento de estado global com Context API.

### Embarcados (`.\embarcados`)
Contém o código para os dispositivos físicos (pulseiras e jigs) desenvolvidos em C++ para Arduino.

- **`1ESD_Monitor`**: Código para o monitor ESD.
  - **`main`**: Código principal do monitor.
- **`2ESD_BaseJig`**: Código para o jig ESD.
  - **`main`**: Código principal do jig.

### Outros Diretórios

- **`.\init-scripts`**: Scripts de inicialização e configuração.
- **`.\.vscode`**: Configurações específicas para o Visual Studio Code.
- **`.\.git`**: Arquivos de controle de versão do Git.

---

## Endpoints da API

Abaixo estão listados todos os endpoints disponíveis no sistema, organizados por controlador, com exemplos de como utilizá-los.

---

### **1. WeatherForecastController**
- **Rota:** `GET /WeatherForecast`
- **Descrição:** Retorna uma previsão do tempo fictícia.
- **Exemplo de requisição:**
```bash
curl -X GET http://localhost:5000/WeatherForecast
```
- **Exemplo de resposta:**
```json
[
  {
    "date": "2025-04-17",
    "temperatureC": 25,
    "temperatureF": 77,
    "summary": "Warm"
  },
  {
    "date": "2025-04-18",
    "temperatureC": 30,
    "temperatureF": 86,
    "summary": "Hot"
  }
]
```

---

### **2. AuthenticationController**
- **Rota:** `POST /api/Authentication`
- **Descrição:** Realiza login e retorna um token JWT.
- **Exemplo de requisição:**
```bash
curl -X POST http://localhost:5000/api/Authentication \
-H "Content-Type: application/json" \
-d '{
  "username": "admin",
  "password": "password123"
}'
```
- **Exemplo de resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "administrador",
  "name": "admin"
}
```

---

### **3. UserController**
- **Rota:** `GET /api/User`
- **Descrição:** Retorna todos os usuários cadastrados.
- **Exemplo de requisição:**
```bash
curl -X GET http://localhost:5000/api/User \
-H "Authorization: Bearer <TOKEN>"
```
- **Exemplo de resposta:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "badge": "12345",
    "created": "2025-04-16T10:00:00",
    "lastUpdated": "2025-04-16T12:00:00"
  }
]
```

---

### **4. StationController**
- **Rota:** `GET /api/Station/todosEstacoes`
- **Descrição:** Retorna todas as estações cadastradas.
- **Exemplo de requisição:**
```bash
curl -X GET http://localhost:5000/api/Station/todosEstacoes \
-H "Authorization: Bearer <TOKEN>"
```
- **Exemplo de resposta:**
```json
[
  {
    "id": 1,
    "name": "Estação 1",
    "sizeX": 10,
    "sizeY": 20,
    "created": "2025-04-16T10:00:00",
    "lastUpdated": "2025-04-16T12:00:00"
  }
]
```

---

### **5. LogMonitorEsdController**
- **Rota:** `GET /api/LogMonitorEsd/ListMonitorEsd`
- **Descrição:** Retorna uma lista de logs de monitores ESD.
- **Exemplo de requisição:**
```bash
curl -X GET "http://localhost:5000/api/LogMonitorEsd/ListMonitorEsd?id=1&page=1&pageSize=10" \
-H "Authorization: Bearer <TOKEN>"
```
- **Exemplo de resposta:**
```json
[
  {
    "id": 1,
    "messageType": "jig",
    "serialNumberEsp": "4",
    "monitorEsdId": 2,
    "jigId": 4,
    "ip": "192.168.0.105",
    "status": 0,
    "messageContent": "2.45",
    "description": "Desconectado",
    "created": "2025-04-16T10:00:00",
    "lastUpdated": "2025-04-16T12:00:00"
  }
]
```

---

### **6. HubController**
- **Rota:** `POST /api/Hub/send-log`
- **Descrição:** Envia um log para o Hub SignalR.
- **Exemplo de requisição:**
```bash
curl -X POST http://localhost:5000/api/Hub/send-log \
-H "Content-Type: application/json" \
-d '"{\"serialNumberEsp\":\"4\",\"monitorEsdId\":2,\"jigId\":4,\"ip\":\"192.168.0.105\",\"messageType\":\"jig\",\"status\":0,\"messageContent\":\"2.45\",\"description\":\"Desconectado\"}"'
```
- **Exemplo de resposta:**
```json
"Log enviado com sucesso!"
```

---

### **7. Outros Endpoints**
#### **StationViewController**
- **Rota:** `GET /api/StationView/todasEstacaoView`
- **Descrição:** Retorna todas as estações view.
- **Exemplo de requisição:**
```bash
curl -X GET http://localhost:5000/api/StationView/todasEstacaoView \
-H "Authorization: Bearer <TOKEN>"
```

#### **RolesController**
- **Rota:** `GET /api/Roles/all`
- **Descrição:** Retorna todas as funções.
- **Exemplo de requisição:**
```bash
curl -X GET http://localhost:5000/api/Roles/all \
-H "Authorization: Bearer <TOKEN>"
```

#### **ProduceActivityController**
- **Rota:** `GET /api/ProduceActivity/TodaProducao`
- **Descrição:** Retorna todos os registros de produção.
- **Exemplo de requisição:**
```bash
curl -X GET http://localhost:5000/api/ProduceActivity/TodaProducao \
-H "Authorization: Bearer <TOKEN>"
```

#### **MonitorEsdController**
- **Rota:** `GET /api/MonitorEsd/todosmonitores`
- **Descrição:** Retorna todos os monitores ESD.
- **Exemplo de requisição:**
```bash
curl -X GET http://localhost:5000/api/MonitorEsd/todosmonitores \
-H "Authorization: Bearer <TOKEN>"
```

#### **LineController**
- **Rota:** `GET /api/Line/TodasLinhas`
- **Descrição:** Retorna todas as linhas.
- **Exemplo de requisição:**
```bash
curl -X GET http://localhost:5000/api/Line/TodasLinhas \
-H "Authorization: Bearer <TOKEN>"
```

#### **JigController**
- **Rota:** `GET /api/Jig/todosJigs`
- **Descrição:** Retorna todos os jigs.
- **Exemplo de requisição:**
```bash
curl -X GET http://localhost:5000/api/Jig/todosJigs \
-H "Authorization: Bearer <TOKEN>"
```

---

## Como rodar o sistema

1. Execute o script `start.ps1` para iniciar o frontend:

```powershell
.\start.ps1
```

2. Use o script Python abaixo para descobrir o IP da rede local:

```python
import socket

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(('8.8.8.8', 80))
    print(s.getsockname()[0])
    s.close()

get_ip()
```

3. Adicione esse endereço IP no CORS do backend em C#:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("http://<SEU_IP>:3000")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});
```

---

## Acesso ao sistema

- **Usuário:** admin  
- **Senha:** admcompal

---

## Testes E2E com Cypress

O projeto inclui testes de ponta-a-ponta utilizando o Cypress.

### Estrutura dos testes

- `cypress/e2e/` – Testes principais:
  - `factoryMap.cy.js`
  - `station.cy.js`
  - `monitor.cy.js`

- `cypress/support/` – Comandos personalizados e configurações globais

- `cypress/fixtures/` – Dados simulados utilizados nos testes

### Observações

- Os testes de **estação** e **monitor** requerem que exista uma **linha cadastrada**.
- O bloco `describe` dos testes já realiza a criação da linha automaticamente.
- Todos os testes executam login automaticamente antes de iniciar.

### Como rodar os testes

Com o sistema rodando, execute:

```bash
npx cypress open
```

---

## Códigos em C++ (Arduino) - Pulseira e Jig

### Pulseira

#### Arquivos:
- `main.ino` – Configuração principal, Wi-Fi e loop de leitura
- `pulseira.cpp` – Captura e envio dos dados da pulseira
- `pulseira.h` – Definições e constantes

#### Principais funções:
- `capturaDadosPulseira()`
- `enviarRequisicaoPulseiraPOST()`
- `conectarWiFi()`

#### Configurações:
- Alterar SSID e senha no `main.ino`
- Configurar pino analógico em `pinPulseira`
- Alterar intervalo em `pulseira.h`
- Alterar URL no `pulseira.cpp`

---

### Jig

#### Arquivos:
- `main.ino` – Configuração principal, Wi-Fi e loop de leitura
- `jig.cpp` – Captura e envio dos dados do Jig
- `jig.h` – Definições e constantes

#### Principais funções:
- `capturaDadosJig()`
- `enviarRequisicaoJigPOST()`
- `conectarWiFi()`

#### Configurações:
- Alterar SSID e senha no `main.ino`
- Configurar pino analógico em `pinJig`
- Alterar intervalo em `jig.h`
- Alterar URL no `jig.cpp`

---

### Manutenção e Depuração

- Reconexão automática à rede Wi-Fi
- Envio de dados ocorre a cada 10s ou quando a tensão muda mais de 0.05V
- Logs são exibidos na serial para diagnóstico
- JSON de envio pode ser alterado para incluir mais parâmetros
