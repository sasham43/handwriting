import { TegakiEngine } from 'tegaki/core';
// import bundle from 'tegaki/fonts/caveat';
import bundle from 'tegaki/fonts/tangerine';

const container = document.getElementById('handwriting');
const input = document.getElementById('input');
const body = document.body;

input.focus();

let text = '';

const engine = new TegakiEngine(container, {
    text,
    font: bundle,
    time: { mode: 'uncontrolled', speed: 2.2, loop: false },
});

// keep input focused
body.addEventListener('click', () => {
    input.focus();
})
input.addEventListener('blur', () => {
    input.focus();
});

input.addEventListener('keyup', (event) => {
    // console.log('event', event.target.value)
    // console.log('input', event.key)
    if(event.key === 'Enter'){
        text += `\n ${event.target.value}`
        engine.update({text})
        // engine.update({text: event.target.value})
        input.value = '';
    }
});