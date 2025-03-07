import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector(`button[data-start]`);
startBtn.disabled = true;
const dateTimePicker = document.querySelector(`#datetime-picker`);
const daysData = document.querySelector(`[data-days]`);
const hoursData = document.querySelector(`[data-hours]`);
const minutesData = document.querySelector(`[data-minutes]`);
const secondsData = document.querySelector(`[data-seconds]`);

let userSelectedDate = null;
let interval;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: '"Please choose a date in the future"',
      });
    } else {
      startBtn.disabled = false;
    }
  },
};
flatpickr(dateTimePicker, options);

startBtn.addEventListener(`click`, () => {
  startTimer();
  startBtn.disabled = true;
  dateTimePicker.disabled = true;
});

function startTimer() {
  interval = setInterval(() => {
    const time = new Date();
    const timeLeft = userSelectedDate - time;

    if (timeLeft <= 0) {
      clearInterval(interval);
      dateTimePicker.disabled = false;
    } else {
      const { days, hours, minutes, seconds } = convertMs(timeLeft);

      daysData.textContent = addLeadingZero(days);
      hoursData.textContent = addLeadingZero(hours);
      minutesData.textContent = addLeadingZero(minutes);
      secondsData.textContent = addLeadingZero(seconds);
    }
  }, 1000);
}

function addLeadingZero(value) {
  return String(value).padStart(2, 0);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
