#include <Arduino.h>
#include <DHTesp.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>

const uint8_t DHT_PIN = 15;
const uint8_t DS18B20_PIN = 4;
const uint8_t OLED_SDA = 21;
const uint8_t OLED_SCL = 22;
const uint8_t SAFE_LED_PIN = 25;
const uint8_t WARNING_LED_PIN = 26;
const uint8_t CRITICAL_LED_PIN = 27;
const uint8_t BUZZER_PIN = 18;
const uint8_t DOOR_BUTTON_PIN = 19;
const uint8_t FAULT_BUTTON_PIN = 32;
const uint8_t SOLAR_BUTTON_PIN = 33;
const uint8_t COOLING_PIN = 23;

const uint32_t SENSOR_INTERVAL_MS = 2000;
const uint32_t BATTERY_INTERVAL_MS = 1000;
const uint32_t OLED_PAGE_INTERVAL_MS = 3000;
const uint32_t ALERT_INTERVAL_MS = 400;
const uint32_t DEBOUNCE_MS = 40;

DHTesp dht;
OneWire oneWire(DS18B20_PIN);
DallasTemperature ds18b20(&oneWire);
Adafruit_SSD1306 display(128, 64, &Wire, -1);

struct ButtonState {
  uint8_t pin;
  bool rawState;
  bool stableState;
  uint32_t lastChange;
};

ButtonState doorButton = {DOOR_BUTTON_PIN, HIGH, HIGH, 0};
ButtonState faultButton = {FAULT_BUTTON_PIN, HIGH, HIGH, 0};
ButtonState solarButton = {SOLAR_BUTTON_PIN, HIGH, HIGH, 0};

enum RiskState { SAFE, WARNING, CRITICAL };
RiskState risk = SAFE;

float roomTemperatureRaw = 6.0f;
float roomTemperatureEffective = 6.0f;
float humidity = 85.0f;
float productTemperatureRaw = 6.1f;
float productTemperatureEffective = 6.1f;
float solarWatts = 320.0f;
float batteryPercent = 85.0f;
float qualityScore = 100.0f;
float shelfLifeDays = 100.0f / 15.0f;
float exposureMinutes = 0.0f;
float storageAgeHours = 6.0f;

// Prototype tomato thresholds and coefficients require real food-science validation.
bool solarDrop = false;
bool doorOpen = false;
bool refrigerationFault = false;
bool coolingOn = true;
uint8_t oledPage = 0;

uint32_t lastSensorRead = 0;
uint32_t lastBatteryUpdate = 0;
uint32_t lastPageChange = 0;
uint32_t lastQualityUpdate = 0;
uint32_t lastAlertToggle = 0;
bool alertPhase = false;

const char *riskText() {
  if (risk == CRITICAL) return "CRITICAL";
  if (risk == WARNING) return "WARNING";
  return "SAFE";
}

const char *getRecommendation() {
  if (risk == CRITICAL) {
    if (refrigerationFault) return "Cooling fault: inspect batch";
    if (batteryPercent < 10.0f) return "Battery critical: arrange backup";
    return "High temp: isolate and inspect";
  }
  if (doorOpen) return "Close door and monitor";
  if (batteryPercent >= 10.0f && batteryPercent <= 30.0f) {
    return "Conserve power, dispatch soon";
  }
  if (roomTemperatureEffective > 8.0f || humidity > 90.0f) {
    return "Restore cooling / Dispatch soon";
  }
  return "Maintain storage";
}

void updateOneButton(ButtonState &button, bool &target) {
  const bool reading = digitalRead(button.pin);
  const uint32_t now = millis();
  if (reading != button.rawState) {
    button.rawState = reading;
    button.lastChange = now;
  }
  if ((now - button.lastChange) >= DEBOUNCE_MS &&
      button.stableState != button.rawState) {
    button.stableState = button.rawState;
    if (button.stableState == LOW) target = !target;
  }
}

void updateButtons() {
  updateOneButton(doorButton, doorOpen);
  updateOneButton(faultButton, refrigerationFault);
  updateOneButton(solarButton, solarDrop);
}

void readSensors() {
  TempAndHumidity dhtReading = dht.getTempAndHumidity();
  if (!isnan(dhtReading.temperature)) roomTemperatureRaw = dhtReading.temperature;
  if (!isnan(dhtReading.humidity)) humidity = constrain(dhtReading.humidity, 0.0f, 100.0f);

  ds18b20.requestTemperatures();
  const float dsReading = ds18b20.getTempCByIndex(0);
  if (dsReading != DEVICE_DISCONNECTED_C && !isnan(dsReading)) {
    productTemperatureRaw = dsReading;
  }

  roomTemperatureEffective = roomTemperatureRaw;
  if (doorOpen) roomTemperatureEffective += 2.5f;
  if (refrigerationFault) roomTemperatureEffective += 5.0f;
  if (batteryPercent < 10.0f) roomTemperatureEffective += 4.0f;
  roomTemperatureEffective = constrain(roomTemperatureEffective, 0.0f, 35.0f);

  const float targetProduct = constrain(
      productTemperatureRaw + max(0.0f, roomTemperatureEffective - productTemperatureRaw) * 0.35f,
      0.0f, 35.0f);
  productTemperatureEffective += (targetProduct - productTemperatureEffective) * 0.25f;
  productTemperatureEffective = constrain(productTemperatureEffective, 0.0f, 35.0f);
}

void updateBattery() {
  if (solarDrop) {
    solarWatts = random(40, 101);
    batteryPercent -= 0.10f;
    if (coolingOn) batteryPercent -= 0.08f;
  } else {
    solarWatts = random(250, 401);
    batteryPercent += 0.03f;
  }
  batteryPercent = constrain(batteryPercent, 0.0f, 100.0f);
}

void updateCooling() {
  coolingOn = !refrigerationFault && batteryPercent >= 10.0f;
}

void calculateRisk() {
  const bool criticalCondition =
      roomTemperatureEffective > 12.0f || !coolingOn ||
      refrigerationFault || batteryPercent < 10.0f;
  if (criticalCondition) {
    risk = CRITICAL;
    return;
  }

  const bool safeCondition =
      roomTemperatureEffective <= 8.0f && humidity <= 90.0f &&
      batteryPercent > 30.0f && coolingOn && !doorOpen &&
      !refrigerationFault;
  risk = safeCondition ? SAFE : WARNING;
}

void calculateQuality() {
  const uint32_t now = millis();
  const float simulatedMinutes = (now - lastQualityUpdate) / 1000.0f;
  lastQualityUpdate = now;
  storageAgeHours += simulatedMinutes / 60.0f;
  if (risk == WARNING) exposureMinutes += simulatedMinutes;
  if (risk == CRITICAL) exposureMinutes += simulatedMinutes * 2.0f;

  const float temperaturePenalty = max(0.0f, roomTemperatureEffective - 8.0f) * 3.0f;
  const float humidityPenalty = max(0.0f, humidity - 90.0f) * 0.5f;
  const float timePenalty = exposureMinutes * 0.04f;
  qualityScore = constrain(100.0f - temperaturePenalty - humidityPenalty - timePenalty,
                           0.0f, 100.0f);
  shelfLifeDays = qualityScore / 15.0f;
}

void updateOutputs() {
  digitalWrite(SAFE_LED_PIN, risk == SAFE);
  digitalWrite(WARNING_LED_PIN, risk == WARNING);
  digitalWrite(CRITICAL_LED_PIN, risk == CRITICAL && alertPhase);
  digitalWrite(BUZZER_PIN, risk == CRITICAL && alertPhase);
  digitalWrite(COOLING_PIN, coolingOn);
}

void printLine(const char *label, const String &value) {
  display.print(label);
  display.println(value);
}

void updateOLED() {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  if (oledPage == 0) {
    display.println("FreshVault Twin");
    printLine("Room: ", String(roomTemperatureEffective, 1) + " C");
    printLine("Food: ", String(productTemperatureEffective, 1) + " C");
    printLine("Hum:  ", String(humidity, 0) + " %");
    printLine("Door: ", doorOpen ? "OPEN" : "CLOSED");
  } else if (oledPage == 1) {
    display.setTextSize(2);
    display.println("Solar");
    display.setTextSize(1);
    printLine("Power: ", String(solarWatts, 0) + " W");
    printLine("Battery: ", String(batteryPercent, 1) + " %");
    printLine("Cooling: ", coolingOn ? "ON" : "OFF");
    printLine("Health: ", refrigerationFault ? "FAULT" : "OK");
  } else if (oledPage == 2) {
    display.setTextSize(2);
    display.println("Batch");
    display.setTextSize(1);
    display.println("TOM-101  Tomato");
    display.println("Stock: 35 kg");
    printLine("Quality: ", String(qualityScore, 1) + " /100");
    printLine("Life: ", String(shelfLifeDays, 1) + " days");
  } else {
    display.setTextSize(2);
    display.println("STATUS");
    display.println(riskText());
    display.setTextSize(1);
    display.println(getRecommendation());
  }
  display.display();
}

void sendJsonToSerial() {
  StaticJsonDocument<1024> json;
  json["timestampMillis"] = millis();
  json["roomTemperatureRaw"] = roomTemperatureRaw;
  json["roomTemperatureEffective"] = roomTemperatureEffective;
  json["humidity"] = humidity;
  json["productTemperatureRaw"] = productTemperatureRaw;
  json["productTemperatureEffective"] = productTemperatureEffective;
  json["solarWatts"] = solarWatts;
  json["batteryPercent"] = batteryPercent;
  json["solarDrop"] = solarDrop;
  json["doorOpen"] = doorOpen;
  json["refrigerationFault"] = refrigerationFault;
  json["coolingOn"] = coolingOn;
  json["refrigerationHealth"] = refrigerationFault ? "FAULT" : "HEALTHY";
  json["risk"] = riskText();
  json["batchId"] = "TOM-101";
  json["crop"] = "Tomato";
  json["quantityKg"] = 35.0f;
  json["storageAgeHours"] = storageAgeHours;
  json["exposureMinutes"] = exposureMinutes;
  json["qualityScore"] = qualityScore;
  json["shelfLifeDays"] = shelfLifeDays;
  json["recommendation"] = getRecommendation();
  serializeJson(json, Serial);
  Serial.println();
}

void setup() {
  Serial.begin(115200);

  pinMode(SAFE_LED_PIN, OUTPUT);
  pinMode(WARNING_LED_PIN, OUTPUT);
  pinMode(CRITICAL_LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(COOLING_PIN, OUTPUT);
  pinMode(DOOR_BUTTON_PIN, INPUT_PULLUP);
  pinMode(FAULT_BUTTON_PIN, INPUT_PULLUP);
  pinMode(SOLAR_BUTTON_PIN, INPUT_PULLUP);

  dht.setup(DHT_PIN, DHTesp::DHT22);
  ds18b20.begin();
  Wire.begin(OLED_SDA, OLED_SCL);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.display();
  randomSeed(micros());

  const uint32_t now = millis();
  lastSensorRead = now - SENSOR_INTERVAL_MS;
  lastBatteryUpdate = now;
  lastPageChange = now;
  lastQualityUpdate = now;
}

void loop() {
  const uint32_t now = millis();
  updateButtons();

  if (now - lastBatteryUpdate >= BATTERY_INTERVAL_MS) {
    lastBatteryUpdate = now;
    updateCooling();
    updateBattery();
    updateCooling();
  }

  if (now - lastSensorRead >= SENSOR_INTERVAL_MS) {
    lastSensorRead = now;
    readSensors();
    calculateRisk();
    calculateQuality();
    sendJsonToSerial();
  }

  if (now - lastAlertToggle >= ALERT_INTERVAL_MS) {
    lastAlertToggle = now;
    alertPhase = !alertPhase;
    updateOutputs();
  }

  if (now - lastPageChange >= OLED_PAGE_INTERVAL_MS) {
    lastPageChange = now;
    oledPage = (oledPage + 1) % 4;
  }

  updateOutputs();
  updateOLED();
}
