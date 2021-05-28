'use strict';
import { getApi } from './general/loader.js';

const dialogItems = document.querySelector('.dialogs-items');
const sendButton = document.querySelector('.send-button');
const messagesWrapper = document.querySelector('.messages');
const inputText = document.querySelector('textarea');
const scrollWrapper = document.querySelector('.scroll-wrapper');

let user;

const load = ['status'];
const special = ['getLastMessageByDialogId', 'getMessagesByDialogId', 'getUserName', 'createMessage', 'getInterlocutors', 'getDialogsByEmail', 'getCurrentUser', 'createDialog'];

const newDialogItem = (name, email, id) => {
    const dialogItemElement = document.createElement('li');
    dialogItemElement.classList.add('list-group-item', 'dialog', 'align-items-end', 'd-flex');
    dialogItemElement.dataset.companionEmail = email;
    dialogItemElement.dataset.dialogId = id;

    dialogItemElement.innerHTML = `
        <img src="../public/img/avatar.jpg" class="ava mr-3 rounded-circle">
        <a href="#">${name}</a>
    `;

    return dialogItemElement;
}

const newMessage = (content, isFirst, isCompanion) => {
    const message = document.createElement('div');
    message.classList.add('message', 'align-items-start', 'd-flex');
    if (isFirst) message.classList.add('first');
    if (isCompanion) message.classList.add('companion-message');

    message.innerHTML = `
    <img class="message-ava rounded-circle" src="../public/img/avatar.jpg" alt="Avatar" />
    <div class="message-text align-items-center d-flex">${content}</div>
`;
    return message;
}

const scrollMessageDown = () => scrollWrapper.scrollTop = 10000;

(async () => {
    window.api = await getApi(load, special);
    user = await api.getCurrentUser();
    const userEmail = user.email;
    console.log(userEmail);
    const dialogs = await api.getDialogsByEmail(userEmail);
    for (const dialog of dialogs) {
        const companionEmail = 
        dialog.user1 === userEmail ? dialog.user2 : dialog.user1;
        const dialogId = dialog.id;
        const companionName = await api.getUserName(companionEmail);

        const dialogItem = newDialogItem(
            companionName,
            companionEmail,
            dialogId
        );
        dialogItems.append(dialogItem);
    }
})();

scrollMessageDown();

dialogItems.addEventListener('click', async event => {
    let activeDialogItem = dialogItems.querySelector('.active');
    const target = event.target;
    if (target.tagName === 'LI') {
        if (activeDialogItem) activeDialogItem.classList.remove('active');
        target.classList.add('active');
        messagesWrapper.innerHTML = '';

        const { dialogId } = target.dataset;
        const messages = await api.getMessagesByDialogId(dialogId);
        console.log(messages);
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const isFirst = message.user1 !== messages[i - 1]?.user1;
            const isCompanion = message.user1 !== user.email;
            const messageItem = newMessage(message.content, isFirst, isCompanion);
            messagesWrapper.append(messageItem);
        }
        scrollMessageDown();
    }
});

sendButton.addEventListener('click', async event => {
    const prevMessage = messagesWrapper.querySelector('.message:last-child');
    const activeDialogItem = dialogItems.querySelector('.active');
    const dialogId = activeDialogItem.dataset.dialogId;

    const user1 = user.email;
    const content = inputText.value;
    const result = await api.createMessage({user1, dialogId, content});

    const message = await api.getLastMessageByDialogId(dialogId);
    const isFirst = !prevMessage || prevMessage.classList.contains('companion-message');
    const isCompanion = false;

    const messageItem = newMessage(message.content, isFirst, isCompanion);
    messagesWrapper.append(messageItem);

    inputText.value = '';

    scrollMessageDown();
});
