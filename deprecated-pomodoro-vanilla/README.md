# Pomodoro Timer ([Demo](https://pomodoro-tau.vercel.app/))

## Description

The Pomodoro Technique is a time management method that uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. [WIKI](https://en.wikipedia.org/wiki/Pomodoro_Technique)

## Functionality

### Timers (Default)

- Pomodoro - 25 minutes of work
- Short break - 5 minutes
- Long break - 15 minutes

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

- Users can adjust the amount of minutes for work (pomodoro), short break, and long break.
  - Users can press and hold down the `+` or `-` buttons to quickly span to their preferred time (desktop only).
  - User's adjusted timers will be saved to their browser locally and will persist even when the browser is closed and reopened.
  - User settings are only cleared through clearing their Browser cache / Locally Stored Data.
- Users can adjust the volume of the alarm (alarm audio only works on desktop)
  - Users can click anywhere in the browser to stop the alarm - the alarm loops for 3 short intervals

## Utilized

- JavaScript (ECMAScript 6)
- HTML/CSS
- [Bulma](https://bulma.io/)
- [Parcel](https://parceljs.org/)
- [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) for Timers
- [Vercel](https://vercel.com/)

## To Add

- Unique sounds for Timers
- Enter preferred time through keyboard in settings

## Timeline

- `Jan 6, 2020`: Used one script file for entire logic and a very basic stylesheet.
- `March 8, 2020`: Refactored function declarations to function expressions and grouped them into IIFE (Immediately Invoked Function Expression) to prevent global space pollution.
- `Apr 17, 2020`: Refactored the timer logic for better maintainability.
- `July 4, 2020`: Used Bulma framework for convenient styling and parcel to bundle IIFE into their own modules/files for readability and maintenance.
- `Jul 14, 2020`: Added local storage for timers.