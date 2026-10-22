import { TegakiEngine } from 'tegaki/core';
import bundle from 'tegaki/fonts/caveat';

const container = document.getElementById('tegaki');

const engine = new TegakiEngine(container, {
    text: 'Hello World',
    font: bundle,
    time: { mode: 'uncontrolled', speed: 1, loop: true },
});