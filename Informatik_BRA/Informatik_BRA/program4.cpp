#include <stdio.h>

int main_4(){
    float n = 0;
    float num = 0;
    float sum = 0;

    printf("Anzahl der Summanden: ");
    scanf_s("%f", &n);

    for (int i = 0; i < n; i++) {
        printf("Enter number: ");
        scanf_s("%f", &num);

        sum = sum + num;
    }

    printf("Summe: %f", sum);
    printf("Durchschnitt: %f", sum / n);

    return 0;
}