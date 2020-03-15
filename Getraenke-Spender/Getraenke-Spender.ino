int selectLed1 = 2;
int selectLed2 = 3;                      
int selectLed3 = 4;                      
int startLed = 5;

int selectButton1 = 6;
int selectButton1State = 0;

int selectButton2 = 7;
int selectButton2State = 0;

int selectButton3 = 8;
int selectButton3State = 0;

int startButton = 9;
int startButtonState = 0;

int pumps[3] = {10, 11, 12}; //define pump pins left1 to right3
int selectedPump = 0;
bool waitingForSelection = true;

// in milliseconds
int waitForPump = 5000; 

void setup() {
  Serial.begin(9600);
  pinMode(selectLed1, OUTPUT);
  pinMode(selectLed2, OUTPUT);            
  pinMode(selectLed3, OUTPUT);
  pinMode(startLed, OUTPUT);

  pinMode(pumps[0], OUTPUT);
  pinMode(pumps[1], OUTPUT);
  pinMode(pumps[2], OUTPUT);
  
  pinMode(selectButton1, INPUT);
  pinMode(selectButton2, INPUT);
  pinMode(selectButton3, INPUT);
  pinMode(startButton, INPUT);

  digitalWrite(selectLed1, HIGH);
  digitalWrite(selectLed2, HIGH);
  digitalWrite(selectLed3, HIGH);
  digitalWrite(startLed, LOW);

  digitalWrite(pumps[0], HIGH);
  digitalWrite(pumps[1], HIGH);
  digitalWrite(pumps[2], HIGH);
}

void loop() {
  while(waitingForSelection){
    selectButton1State = digitalRead(selectButton1);
    selectButton2State = digitalRead(selectButton2);
    selectButton3State = digitalRead(selectButton3);
    if (selectButton1State == HIGH) {
      digitalWrite(selectLed1, HIGH);
      digitalWrite(selectLed2, LOW);
      digitalWrite(selectLed3, LOW);
      digitalWrite(startLed, HIGH);
      selectedPump = 0;
      waitingForSelection = false;
      Serial.write("Selected 1");
    }else if(selectButton2State == HIGH){
      digitalWrite(selectLed1, LOW);
      digitalWrite(selectLed2, HIGH);
      digitalWrite(selectLed3, LOW);
      digitalWrite(startLed, HIGH);
      selectedPump = 1;
      waitingForSelection = false;
      Serial.write("Selected 2");
    }else if(selectButton3State == HIGH){
      digitalWrite(selectLed1, LOW);
      digitalWrite(selectLed2, LOW);
      digitalWrite(selectLed3, HIGH);
      digitalWrite(startLed, HIGH);
      selectedPump = 2;
      waitingForSelection = false;
      Serial.write("Selected 3");
    }
    Serial.write("waiting for selection...\n");
  }
  startButtonState = digitalRead(startButton);
  if (startButtonState == HIGH) {
    Serial.write("Started");
    int pump = pumps[selectedPump];
    digitalWrite(pump, LOW);
    delay(waitForPump);
    digitalWrite(pump, HIGH);
    selectedPump = 0;
    digitalWrite(selectLed1, HIGH);
    digitalWrite(selectLed2, HIGH);
    digitalWrite(selectLed3, HIGH);
    digitalWrite(startLed, LOW);
    waitingForSelection = true;
  }
  
  Serial.write("waiting to press start...\n");
} 
