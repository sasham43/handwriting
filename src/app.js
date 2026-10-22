import { TegakiEngine } from 'tegaki/core';
import bundle from 'tegaki/fonts/caveat';

const container = document.getElementById('tegaki');

const input = document.getElementById('input');

input.focus();

let text = '';

const engine = new TegakiEngine(container, {
    text,
    font: bundle,
    time: { mode: 'uncontrolled', speed: 1, loop: false },
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
})