#ifndef JIG_H
#define JIG_H

#include <Arduino.h>
#include <WiFi.h>

// Configurações comuns
  
const int resolucaoADC = 4095;
const float limiteTensao = 0.1;
const float faixaTensao = 0.05;
const unsigned long intervalo = 5000;
const int monitorEspId = 1;

// Variaveis externos para que possam ser usados em jig.cpp / main.io
extern const char* ssid;
extern const char* password;
extern unsigned long wifiCheckInterval;
extern unsigned long lastWifiCheck;



struct JigState {
    int pin;
    int id;
    float lastVoltage;
    unsigned long lastSendTime;
};

// Array de estados dos Jigs
extern JigState jigs[3]; 

// Funções externas
void conectarWiFi();
void enviarRequisicaoJigPOST(const String& payload);
void monitorarJigs();

#endif
