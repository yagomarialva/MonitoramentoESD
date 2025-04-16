#ifndef PULSEIRA_H
#define PULSEIRA_H

#include <Arduino.h>
#include <WiFi.h>

// Configurações fixas para pulseira
const float VRef = 3.3;
const int resolucaoADC = 4095;
const float limiteTensao = 1.0;
const float faixaTensao = 0.05;
const unsigned long intervalo = 2000;
const int monitorEspId = 1; // ID único para o dispositivo Monitor
// Variaveis externos para que possam ser usados em pulseira.cpp / main.io
extern const char* ssid;
extern const char* password;
extern unsigned long wifiCheckInterval;
extern unsigned long lastWifiCheck;

// Declarações de funções
void conectarWiFi();
void capturaDadosPulseira(IPAddress& localIP, int pin);
void enviarRequisicaoPulseiraPOST(const String& payload);

#endif
