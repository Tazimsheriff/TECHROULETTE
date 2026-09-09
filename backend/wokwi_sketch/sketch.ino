#include <WiFi.h>
#include <HTTPClient.h>
#include <DHTesp.h>

#define DHT_PIN 15
#define DOOR_SWITCH_PIN 4
#define FAULT_BUTTON_PIN 5
#define COOLING_LED_PIN 18
#define ALARM_LED_PIN 19

DHTesp dhtSensor;
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// FreshVault Twin API Host (Local network / ngrok / port forward)
const char* serverUrl = "http://localhost:8000/api/sensor-data";

void setup() {
  Serial.begin(115200);
  Serial.println("=========================================");
  Serial.println("FreshVault Twin - IoT Cold Storage Node");
  Serial.println("Target: Solar Tomato Cold Storage Unit");
  Serial.println("=========================================");

  pinMode(DOOR_SWITCH_PIN, INPUT_PULLUP);
  pinMode(FAULT_BUTTON_PIN, INPUT_PULLUP);
  pinMode(COOLING_LED_PIN, OUTPUT);
  pinMode(ALARM_LED_PIN, OUTPUT);

  dhtSensor.setup(DHT_PIN, DHTesp::DHT22);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 15) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWi-Fi Connected! IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\nWi-Fi Simulation Standalone Mode");
  }
}

void loop() {
  TempAndHumidity data = dhtSensor.getTempAndHumidity();
  bool doorOpen = (digitalRead(DOOR_SWITCH_PIN) == LOW);
  bool faultTriggered = (digitalRead(FAULT_BUTTON_PIN) == LOW);

  float temperature = data.temperature;
  float humidity = data.humidity;

  if (isnan(temperature) || isnan(humidity)) {
    temperature = 6.2;
    humidity = 84.0;
  }

  // Visual status LEDs
  if (temperature > 12.0 || faultTriggered) {
    digitalWrite(ALARM_LED_PIN, HIGH);
    digitalWrite(COOLING_LED_PIN, LOW);
  } else {
    digitalWrite(ALARM_LED_PIN, LOW);
    digitalWrite(COOLING_LED_PIN, HIGH);
  }

  // Print telemetry to serial monitor
  Serial.printf("[TELEMETRY] Temp: %.2f C | Humidity: %.1f %% | Door: %s | Status: %s\n",
    temperature, humidity,
    doorOpen ? "OPEN" : "CLOSED",
    faultTriggered ? "FAULT DETECTED" : "NOMINAL"
  );

  // Send JSON payload if Wi-Fi connected
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = String("{") +
      "\"temperature\":" + String(temperature, 2) + "," +
      "\"humidity\":" + String(humidity, 1) + "," +
      "\"doorOpen\":" + (doorOpen ? "true" : "false") + "," +
      "\"coolingOn\":" + (faultTriggered ? "false" : "true") +
      "}";

    int httpResponseCode = http.POST(jsonPayload);
    Serial.printf("[HTTP] POST Response: %d\n", httpResponseCode);
    http.end();
  }

  delay(3000);
}
