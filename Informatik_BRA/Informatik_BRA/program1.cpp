#include <stdio.h>

int main_1(){

    int num1 = 0;
    int num2 = 0;
    int result = 0;

    printf("Enter number 1: ");
    scanf_s("%d", &num1);

    printf("Enter number 2: ");
    scanf_s("%d", &num2);

    result = num1 + num2;

    printf("Result: %i", result);

    return 0;
}