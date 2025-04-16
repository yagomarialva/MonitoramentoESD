#include "esp32-hal.h"
#include "pulseira.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Função para conectar ao Wi-Fi com persistência de conexão
void conectarWiFi() {
    Serial.println("Tentando conectar ao WiFi...");
    WiFi.begin(ssid, password);
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("Conectado ao WiFi!");
    Serial.println(WiFi.localIP());
}

// Função para enviar os dados capturados via POST
void enviarRequisicaoPulseiraPOST(const String& payload) {
    Serial.println(payload);
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin("http://192.168.0.100:7080/api/LogMonitorEsd/ManagerLogs");
        http.addHeader("Content-Type", "application/json");
        int httpCode = http.POST(payload);
        if (httpCode > 0) {
            String response = http.getString();
            Serial.println("Resposta do servidor: " + response);
        } else {
            Serial.println("Erro na requisição");
            Serial.println(httpCode);
        }
        http.end();
    } else {
        Serial.println("WiFi não está conectado");
    }
}

// Função para capturar e enviar os dados da pulseira
void capturaDadosPulseira(IPAddress& localIP, int pin) {
    float lastVoltage = -1;
    unsigned long lastSend = 0;

    while (true) {
        // Leitura do valor analógico do pino configurado
        int analogValue = analogRead(pin);
        float voltage = (analogValue * VRef) / resolucaoADC;

        // Verifica se a tensão mudou significativamente ou se já passou o intervalo definido
        if ((abs(voltage - lastVoltage) > faixaTensao) || (millis() - lastSend >= intervalo)) {
          String statusDesc = (voltage > limiteTensao) ? "Conectado" : "Desconectado";

          //Criar JSON
            DynamicJsonDocument doc(512);
            doc["serialNumberEsp"] = String(monitorEspId);
            doc["monitorEsdId"] = monitorEspId;
            doc["ip"] = localIP.toString();
            doc["messageType"] = "operador";
            doc["status"] = (voltage >= limiteTensao) ? 1 : 0;
            doc["messageContent"] = String(voltage, 2);
            doc["description"] = statusDesc;

            String json;
            serializeJson(doc, json);
            enviarRequisicaoPulseiraPOST(json);

            lastVoltage = voltage;
            lastSend = millis();
        }
        delay(200);  // Pequeno atraso para evitar leituras muito frequentes
    }
}
