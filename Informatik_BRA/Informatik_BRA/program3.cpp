#include <stdio.h>

int main_3(){

    float num1 = 0;
    float num2 = 0;
    char op;
    float res = 0;

    printf("Enter number 1: ");
    scanf_s("%f", &num1);
    printf("Enter number 2: ");
    scanf_s("%f", &num2);
    printf("Enter operation: ");
    scanf_s("%c", &op);

    if (op == '+') res = num1 + num2;
    else if (op == '-') res = num1 - num2;
    else if (op == '*') res = num1 * num2;
    else if (op == '/' && num2 != 0) res = num1 / num2;
    else printf("Fehler: Ungültige Eingabe!");
    printf("Result: %f", res);
   
   return 0;
}