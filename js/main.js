const modal = document.getElementById('leadModal');
document.querySelectorAll('.js-open-modal').forEach((button) => {
  button.addEventListener('click', () => modal.classList.add('open'));
});
document.querySelector('.modal-close').addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.classList.remove('open');
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') modal.classList.remove('open');
});

const callbackForm = document.getElementById('callbackForm');
const formStatus = document.getElementById('formStatus');
callbackForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = callbackForm.querySelector('button[type="submit"]');
  const formData = new FormData(callbackForm);

  if (formData.get('_honey')) return;

  const payload = {
    Имя: formData.get('Имя'),
    Телефон: formData.get('Телефон'),
    'Желаемое время звонка': formData.get('Желаемое время звонка'),
    _subject: 'Новая заявка на звонок с лендинга ПИНТА',
    _template: 'table'
  };

  submitButton.disabled = true;
  submitButton.textContent = 'Отправляем...';
  formStatus.className = 'form-status';
  formStatus.textContent = '';

  try {
    const response = await fetch('https://formsubmit.co/ajax/lenochkash@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Ошибка отправки');
    const result = await response.json();
    if (result.success === false) throw new Error(result.message || 'Ошибка отправки');

    callbackForm.reset();
    formStatus.className = 'form-status success';
    formStatus.textContent = 'Спасибо! Заявка отправлена. Мы свяжемся с вами в указанное время.';
  } catch (error) {
    formStatus.className = 'form-status error';
    formStatus.textContent = 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Отправить';
  }
});
