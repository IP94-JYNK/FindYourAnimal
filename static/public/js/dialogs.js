'use strict';
///import { create } from 'eslint/lib/rules/*';
import { getApi } from './general/loader.js';

const dialogItems = document.querySelector('.dialogs-items');
const sendButton = document.querySelector('.send-button');
const messagesWrapper = document.querySelector('.messages');
const inputText = document.querySelector('textarea');
const scrollWrapper = document.querySelector('.scroll-wrapper');

let user;

const load = ['status'];
const special = ['getMessagesByDialogId', 'getUserName', 'createMessage', 'getInterlocutors', 'getDialogsByEmail', 'getCurrentUser', 'createDialog'];

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

/**
 *               <div class="message companion-message first align-items-start d-flex" }>
                <img class="message-ava rounded-circle" src="../public/img/avatar.jpg" alt="" />
                <div class="message-text align-items-center d-flex">
                  Hello!
                </div>
              </div>
 */

(async () => {
    window.api = await getApi(load, special);
    user = await api.getCurrentUser();
    const userEmail = user.email;
    console.log(userEmail);
    const dialogs = await api.getDialogsByEmail(userEmail);
    for (const dialog of dialogs) {
        const companionEmail = 
        dialog.user1 === userEmail ? dialog.user2 : dialog.user1;
        console.log()
        const dialogId = dialog.id;
        const companionName = await api.getUserName(companionEmail);

        const dialogItem = newDialogItem(
            companionName,
            companionEmail,
            dialogId
        );
        dialogItems.append(dialogItem);
    }
    /*
    console.log(dialogs);
    const interlocutors = await api.getInterlocutors(userEmail);
    console.log(interlocutors);
    for (const interlocutor of interlocutors) {
        const dialogItem = newDialogItem(interlocutor.name);
        dialogItems.append(dialogItem);
    }*/
    //const result = api.createDialog({ user1: user.email, user2: 'yulia032022@gmail.com' });
    //const result = api.createMessage({ user1: 'yulia032022@gmail.com', dialogId: 2, content: 'How are you?' });
    //const result = api.createMessage({ user1: 'yulia032022@gmail.com', dialogId: 2, content: 'Ok' });
    //console.log(result);
})();

scrollWrapper.scrollTop = 10000;

dialogItems.addEventListener('click', async event => {
    let activeDialogItem = document.querySelector('.dialogs-items .active');
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
        scrollWrapper.scrollTop = 10000;
    }
});

sendButton.addEventListener('click', (event) => {
    const lastMessage = messages.querySelector('.message:last-child');
    const messageText = inputText.value;

    //const user1 = user.email;
    ///const {dialogId} = lastMessage.dataset;

    let messageClass = 'message align-items-start d-flex';
    messageClass += (!lastMessage || lastMessage.classList.contains('companion-message')) ? 'first' : '';

    inputText.value = '';
    messages.insertAdjacentHTML('beforeend',
        `
    <div class="${messageClass}" }>
        <img class="message-ava rounded-circle" src="../public/img/avatar.jpg" alt="" />
        <div class="message-text align-items-center d-flex">${messageText}</div>
    </div>
`
    )
});


