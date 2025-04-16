#include <Arduino.h>
#include <WiFi.h>
#include "pulseira.h"

// Credenciais Wi-Fi
const char* ssid = "FCT_AUTO_TEST";
const char* password = "12345678";

// Pino monitorado
int pinPulseira = 25;

unsigned long lastWifiCheck = 0;
unsigned long wifiCheckInterval = 5000;  // Verifica o Wi-Fi a cada 5 segundos

void setup() {
    Serial.begin(115200);
    
   conectarWiFi();


    // Configura o pino da pulseira e a resolução do ADC
    pinMode(pinPulseira, INPUT);
    analogReadResolution(12);  // Define a resolução do ADC para 12 bits (0 a 4095)
    
    // Inicializa a conexão Wi-Fi
    
    // Captura os dados da pulseira
    IPAddress localIP = WiFi.localIP();
    capturaDadosPulseira(localIP, pinPulseira);  // Passa o pino como parâmetro
}

void loop() {
    // Verifica e tenta reconectar ao Wi-Fi caso esteja desconectado
    unsigned long currentMillis = millis();
    if (currentMillis - lastWifiCheck >= wifiCheckInterval) {
        if (WiFi.status() != WL_CONNECTED) {
            Serial.println("Reconectando ao WiFi...");
            conectarWiFi();
        }
        lastWifiCheck = currentMillis;
    }
}
