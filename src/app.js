import { TegakiEngine } from 'tegaki/core';
// import bundle from 'tegaki/fonts/caveat';
import bundle from 'tegaki/fonts/tangerine';

const speed = 1;

const container = document.getElementById('handwriting');
const input = document.getElementById('input');
const body = document.body;

let isMenuShowing = false;
const menu = document.getElementById('menu');
const menu1 = document.getElementById('menu-play-poem');
const menu2 = document.getElementById('menu-read-crystal');
const menu3 = document.getElementById('menu-save-crystal');
const menu4 = document.getElementById('menu-clear poem');

input.focus();

let text = '';

const engine = new TegakiEngine(container, {
    text,
    font: bundle,
    time: { mode: 'uncontrolled', speed, loop: false },
});

// scroll logic
const scroller = document.getElementById('scroller');
const content = document.getElementById('content');

const ro = new ResizeObserver(() => {
  scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
});
ro.observe(content);

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

        scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
    }

    if(event.key === 'Alt'){
        isMenuShowing = false;
        hideMenu();
    }
});

// modifider menu logic
input.addEventListener('keydown', (event => {
    const key = event.key;

    console.log('keydown key', event)

    if(key === 'Alt'){
        console.log('we got an alt baby');
        isMenuShowing = true;
        showMenu();
    }

    if(key === '¡'){
        runCommand('1')
    }
    if(key === '™'){
        runCommand('2')
    }
    if(key === '£'){
        runCommand('3')
    }
    if(key === '¢'){
        event.preventDefault();
        runCommand('4')
    }
}));

function showMenu(){
    menu.classList.add('show-menu');
}

function hideMenu(){
    menu.classList.remove('show-menu');
}

function runCommand(command){
    if(!isMenuShowing) return;

    switch(command){
        case '1':
            playPoem();
            break;
        case '2':
            readCrystal();
            break;
        case '3':
            saveToCrystal();
            break;
        case '4':
            clearPoem();
            break;
    }
}

function playPoem(){}

function readCrystal(){
    //
}

function saveToCrystal(){}

function clearPoem(){
    text = '';
    engine.update({text})
    input.value = '';
}