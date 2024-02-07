/*
Требуется написать функцию, выводящую в консоль числа от 1 до n, где n — это целое число, которое функция принимает в качестве параметра, с такими условиями:
 
вывод fizz вместо чисел, кратных 3;
вывод buzz вместо чисел, кратных 5;
вывод fizzbuzz вместо чисел, кратных как 3, так и 5.
*/

function action(n) {
  for (let index = 1; index <= n; index++) {
    let output = index;
    if (index % 3 === 0) {
      output = 'fizz';
      if (index % 5 === 0) {
        output += 'buzz';
      }
    }
    if (index % 5 === 0) {
      output = 'buzz';
    }
    console.log(output);
  }
}

action(255);