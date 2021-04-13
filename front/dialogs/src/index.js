'use strict';

const dialogItemsWrapper = document.querySelector('.dialogs-items');
let activeDialogItem = document.querySelector('.dialogs-items .active');
const sendButton = document.querySelector('.send-button');
const messages = document.querySelector('.messages');
const inputText = document.querySelector('textarea');
const scrollWrapper = document.querySelector('.scroll-wrapper');

scrollWrapper.scrollTop = 10000;

dialogItemsWrapper.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'LI') {
        if (activeDialogItem) activeDialogItem.classList.remove('active');
        target.classList.add('active');
        activeDialogItem = target;
    }
});

sendButton.addEventListener('click', (event) => {
    const lastMessage = messages.querySelector('.message:last-child');
    const messageText = inputText.value;
    let messageClass = 'message align-items-start d-flex';
    messageClass += (!lastMessage || lastMessage.classList.contains('companion-message')) ? 'first' : '';

    inputText.value = '';
    messages.insertAdjacentHTML('beforeend',
`
    <div class="${messageClass}" }>
        <img class="message-ava rounded-circle" src="img/avatar.jpg" alt="" />
        <div class="message-text align-items-center d-flex">${messageText}</div>
    </div>
`
)

    scrollWrapper.scrollTop = 10000;
});
