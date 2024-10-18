(function (exports) {
    'use strict';

    var extend, createElements, createCountdownElt, simplyCountdown;

    // Function to merge user parameters with defaults
    extend = function (out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];
            if (obj) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        out[key] = typeof obj[key] === 'object'
                            ? extend(out[key], obj[key])
                            : obj[key];
                    }
                }
            }
        }
        return out;
    };

    // Create a countdown section
    createCountdownElt = function (countdown, parameters, typeClass) {
        var section = document.createElement('div'),
            amount = document.createElement('span'),
            word = document.createElement('span');

        section.appendChild(amount);
        section.appendChild(word);

        section.classList.add(parameters.sectionClass, typeClass);
        amount.classList.add(parameters.amountClass);
        word.classList.add(parameters.wordClass);

        countdown.appendChild(section);

        return { full: section, amount: amount, word: word };
    };

    // Create full countdown DOM elements
    createElements = function (parameters, countdown) {
        return {
            days: createCountdownElt(countdown, parameters, 'simply-days-section'),
            hours: createCountdownElt(countdown, parameters, 'simply-hours-section'),
            minutes: createCountdownElt(countdown, parameters, 'simply-minutes-section'),
            seconds: createCountdownElt(countdown, parameters, 'simply-seconds-section')
        };
    };

    // Countdown function
    simplyCountdown = function (elt, args) {
        var parameters = extend({
            year: 2024,
            month: 11,   // November
            day: 14,     // 14th
            hours: 0,
            minutes: 0,
            seconds: 0,
            words: {
                days: 'day',
                hours: 'hour',
                minutes: 'minute',
                seconds: 'second',
                pluralLetter: 's'
            },
            plural: true,
            inline: false,
            enableUtc: false,  // Use local time
            refresh: 1000,
            sectionClass: 'simply-section',
            amountClass: 'simply-amount',
            wordClass: 'simply-word',
            zeroPad: true,
            onEnd: function () {
                alert('The wedding day has arrived!');
            }
        }, args);

        var interval, targetDate, now, secondsLeft, days, hours, minutes, seconds;
        var cd = document.querySelectorAll(elt);

        // Set the target date (local time)
        targetDate = new Date(parameters.year, parameters.month - 1, parameters.day, parameters.hours, parameters.minutes, parameters.seconds);

        Array.prototype.forEach.call(cd, function (countdown) {
            var elements = createElements(parameters, countdown);

            var refresh = function () {
                now = new Date();
                secondsLeft = (targetDate - now) / 1000;

                if (secondsLeft > 0) {
                    days = Math.floor(secondsLeft / 86400);
                    secondsLeft %= 86400;

                    hours = Math.floor(secondsLeft / 3600);
                    secondsLeft %= 3600;

                    minutes = Math.floor(secondsLeft / 60);
                    seconds = Math.floor(secondsLeft % 60);
                } else {
                    days = hours = minutes = seconds = 0;
                    clearInterval(interval);
                    parameters.onEnd();
                }

                elements.days.amount.textContent = parameters.zeroPad && days < 10 ? '0' + days : days;
                elements.days.word.textContent = days === 1 ? parameters.words.days : parameters.words.days + parameters.words.pluralLetter;

                elements.hours.amount.textContent = parameters.zeroPad && hours < 10 ? '0' + hours : hours;
                elements.hours.word.textContent = hours === 1 ? parameters.words.hours : parameters.words.hours + parameters.words.pluralLetter;

                elements.minutes.amount.textContent = parameters.zeroPad && minutes < 10 ? '0' + minutes : minutes;
                elements.minutes.word.textContent = minutes === 1 ? parameters.words.minutes : parameters.words.minutes + parameters.words.pluralLetter;

                elements.seconds.amount.textContent = parameters.zeroPad && seconds < 10 ? '0' + seconds : seconds;
                elements.seconds.word.textContent = seconds === 1 ? parameters.words.seconds : parameters.words.seconds + parameters.words.pluralLetter;
            };

            refresh();
            interval = setInterval(refresh, parameters.refresh);
        });
    };

    exports.simplyCountdown = simplyCountdown;
}(window));

// jQuery plugin support
if (window.jQuery) {
    (function ($, simplyCountdown) {
        $.fn.simplyCountdown = function (options) {
            simplyCountdown(this.selector, options);
            return this;
        };
    }(jQuery, simplyCountdown));
}

// Call the countdown after the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    simplyCountdown('.my-countdown', {
        year: 2024,
        month: 11,
        day: 14,
        onEnd: function () {
            alert('The wedding day has arrived!');
        }
    });
});
