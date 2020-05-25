#include <stdio.h>

int main_2(){

    int num1 = 0;
    int num2 = 0;
    int num3 = 0;
    int max = 0;

    printf("Enter number 1: ");
    scanf_s("%d", &num1);
    printf("Enter number 2: ");
    scanf_s("%d", &num2);
    printf("Enter number 3: ");
    scanf_s("%d", &num3);

    if (num1 >= num2 && num1 >= num3) {
        max = num1;
    }
    else if (num2 >= num1 && num2 >= num3) {
         max = num2;
    }
    else if (num3 >= num1 && num3 >= num2) {
        max = num3;
    }

    printf("Maximum: %i", max);

return 0;
}

