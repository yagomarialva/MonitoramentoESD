#include "jig.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>

JigState jigs[] = {
    {32, 3, -1, 0}, // Jig 3: pino 32
    {34, 2, -1, 0}, // Jig 2: pino 34
    {35, 4, -1, 0}  // Jig 4: pino 35
};

void conectarWiFi() {
    Serial.println("Tentando conectar ao WiFi...");
    WiFi.begin(ssid, password);
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("\nConectado ao WiFi!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
}

void enviarRequisicaoJigPOST(const String& payload) {
    Serial.println("Enviando dados do Jig:");
    Serial.println(payload);
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin("http://192.168.0.111:7080/api/LogMonitorEsd/ManagerLogs");
        http.addHeader("Content-Type", "application/json");

        int retryCount = 0;
        int httpCode = -1;
        String response;
        
        // Tentar até 3 vezes em caso de falha
        while (retryCount < 3 && httpCode <= 0) {
            httpCode = http.POST(payload);
            response = (httpCode > 0) ? http.getString() : "Erro: " + String(httpCode);
            retryCount++;
        }
        
        Serial.print("Resposta do servidor: ");
        Serial.println(response);
        http.end();
    } else {
        Serial.println("WiFi não está conectado");
    }
}

void monitorarJigs() {
    unsigned long currentMillis = millis();

    for (auto& jig : jigs) {
        int analogValue = analogRead(jig.pin);  // Leitura do ADC
        float voltage = (analogValue * VRef) / resolucaoADC;  // Conversão para tensão

        // Enviar se a tensão mudar significativamente ou se passar o intervalo
        if ((abs(voltage - jig.lastVoltage) > faixaTensao) || (currentMillis - jig.lastSendTime >= intervalo)) {
            String statusDesc = (voltage < limiteTensao) ? "Conectado" : "Desconectado";
            int status = (voltage < limiteTensao) ? 1 : 0;

            // Criar JSON
            DynamicJsonDocument doc(1024);  // Tamanho reduzido
            doc["serialNumberEsp"] = String(jig.id);
            doc["monitorEsdId"] = monitorEspId;
            doc["jigId"] = jig.id;
            doc["ip"] = WiFi.localIP().toString();
            doc["messageType"] = "jig";
            doc["status"] = status;
            doc["messageContent"] = String(voltage, 2);
            doc["description"] = statusDesc;

            String json;
            serializeJson(doc, json);
            enviarRequisicaoJigPOST(json);

            jig.lastVoltage = voltage;
            jig.lastSendTime = currentMillis;
        }
         delay(5000);  // Pequeno atraso para evitar leituras muito frequentes
    }
}
