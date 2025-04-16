#include <Arduino.h>
#include <WiFi.h>
#include "jig.h"

const char* ssid = "FCT_AUTO_TEST";
const char* password = "12345678";

unsigned long lastWifiCheck = 0;
unsigned long wifiCheckInterval = 5000;  // Intervalo para verificar a conexão Wi-Fi

void setup() {
    Serial.begin(115200);
    analogReadResolution(12);  // Resolução de 12 bits

    // Configurar todos os pinos dos Jigs
    for (auto& jig : jigs) {
        pinMode(jig.pin, INPUT);
        Serial.printf("Configurado Jig ID %d no pino %d\n", jig.id, jig.pin);
    }

    // Conectar ao WiFi
    conectarWiFi();
}

void loop() {
    unsigned long currentMillis = millis();

    // Verificar a conexão Wi-Fi a cada 5 segundos
    if (currentMillis - lastWifiCheck >= wifiCheckInterval) {
        if (WiFi.status() != WL_CONNECTED) {
            conectarWiFi();
        }
        lastWifiCheck = currentMillis;
    }

    monitorarJigs();  // Monitoramento contínuo dos Jigs
}
