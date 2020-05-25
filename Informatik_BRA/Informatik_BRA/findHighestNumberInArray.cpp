#include <stdio.h>

int main(){
	int numbers[11] = { 5, 222, 10, 2, 1, 5, 7, 9, 100, 20, 60 };
	int result = 0;
	size_t numbers_length = sizeof(numbers) / sizeof(numbers[0]);

	for (int i = 0; i < numbers_length; i++) {
		if (numbers[i] >= result) {
			result = numbers[i];
		}
	}

	printf("max: %i", result);

	return 0;
}