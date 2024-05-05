const FORM_URL = 'https://shagwpered.ru/php/vlados/submit_db.php';
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzEjSdhFWFhqWzYJa_Xi6URKB5auWTcJk9XEQ6us597Ts8CvrNTizSXryDLUpzvOEqrXw/exec';

const form = document.querySelector('#contact_form');

function isFilled(details) {
  const { name, tg } = details;
  return name && tg; // Проверяем, что оба поля заполнены
}

form.addEventListener('submit', async ev => {
  ev.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const tg = document.querySelector('#tg').value.trim();
  const phone = document.querySelector('#phone').value.trim();
  const message = document.querySelector('#message').value.trim();

  let details = { name, tg, phone, message };

  if (!isFilled(details)) {
    alert('Пожалуйста, заполните все обязательные поля.');
    return;
  }

  let formBody = new URLSearchParams(details).toString();

  try {
    // Отправка данных в Google Sheets
    const responseGoogle = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody,
    });
    const resultGoogle = await responseGoogle.json();

    console.log('Ответ от Google Sheets:', resultGoogle); // Добавляем отладочную информацию

    if (resultGoogle.type === 'success') {
      // Отправка данных на сервер PHP
      const responseDB = await fetch(FORM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formBody,
      });

      if (!responseDB.ok) {
        throw new Error(`Ошибка HTTP: ${responseDB.status}`);
      }

      const resultDB = await responseDB.json();

      console.log('Ответ от PHP сервера:', resultDB); // Добавляем отладочную информацию

      if (resultDB.type === 'success') {
        document.querySelector('#name').value = '';
        document.querySelector('#tg').value = '';
        document.querySelector('#phone').value = '';
        document.querySelector('#message').value = '';
        alert('Спасибо за заявку!');
      } else {
        alert('Произошла ошибка при отправке данных на сервер.');
      }
    } else {
      alert('Произошла ошибка при отправке данных в Google Sheets.');
    }
  } catch (err) {
    alert('Ошибка при отправке данных!');
    console.error('Ошибка:', err); // Логируем ошибку в консоль
  }
});
