
# Sistema de Gestão de Monitores ESD

Este projeto é um sistema para testes ESD, com gerenciamento de **linhas**, **estações** e **monitores**, integrando também componentes físicos como **pulseiras** e **jigs** com microcontroladores.

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
