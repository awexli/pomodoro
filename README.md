# Pomodoro Timer [(Demo)](https://pomodoro-tau.vercel.app/)

## Description

The Pomodoro Technique is a time management method that uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. [WIKI](https://en.wikipedia.org/wiki/Pomodoro_Technique)

## Functionality

### Timers

- Pomodoro - 25 minutes of work (default)
- Short break - 5 minutes (default)
- Long break - 15 minutes (default)

### Loop

The loop functionality completes one cycle. For example - total of 2 hours 10 min

- Work: 25 minutes
- Break: 5 minutes
- Work: 25 minutes
- Break: 5 minutes
- Work: 25 minutes
- Break: 5 minutes
- Work: 25 minutes
- Long break: 15 minutes

### Settings

- You can adjust the amount of minutes for your work, short break, and long break.
  - Your adjusted timers will be saved to your browser locally and will persist even when the browser is closed and reopened.
  - Settings are only cleared through clearing your Browser cache / Locally Stored Data.
- You can adjust the volume of the alarm (only works on desktop)
  - You can click anywhere in the browser to stop the alarm - the alarm loops for 3 short intervals

## Utilized

- JavaScript (ECMAScript 6)
- HTML/CSS
- [Bulma](https://bulma.io/)
- [Parcel](https://parceljs.org/)
- [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) for Timers

## To Add

- Unique sounds for Timers
