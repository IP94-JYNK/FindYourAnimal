'use strict';
import { getApi } from './general/loader.js';

const special = [
    "getLastMessageByDialogId",
    "getMessagesByDialogId",
    "getUserName",
    "createMessage",
    "getDialogsByEmail",
    "getCurrentUser",
    "createDialog"
];

(async () => {
    window.api = await getApi(special);
})();

const newDialogItem = (name, id) => {
    const dialogItemElement = document.createElement('li');
    dialogItemElement.classList.add(
        "list-group-item",
        "dialog",
        "align-items-end",
        "d-flex"
    );
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
    <img
    class="message-ava rounded-circle"
    src="../public/img/avatar.jpg"
    alt="Avatar"
    />
    <div class="message-text align-items-center d-flex">${content}</div>
    `;

    return message;
}

window.addEventListener('load', async () => {
    const dialogItemsWrapper = document.querySelector('.dialogs-items');
    const sendButton = document.querySelector('.send-button');
    const messagesWrapper = document.querySelector('.messages');
    const inputText = document.querySelector('textarea');
    const scrollWrapper = document.querySelector('.scroll-wrapper');

    let user;

    const scrollMessagesDown = () => scrollWrapper.scrollTop = 10000;

    const result = await api.getCurrentUser();
    user = result.user;
    const userEmail = user.email;
    const { dialogs } = await api.getDialogsByEmail(userEmail);

    for (const dialog of dialogs) {
        const companionEmail =
            dialog.user1 === userEmail ? dialog.user2 : dialog.user1;
        const dialogId = dialog.id;
        const { name: companionName } = await api.getUserName(companionEmail);

        const dialogItem = newDialogItem(
            companionName,
            dialogId
        );
        dialogItemsWrapper.append(dialogItem);
    }

    dialogItemsWrapper.addEventListener('click', async event => {
        const target = event.target;
        if (target.tagName === 'LI') {
            const activeDialogItem =
                dialogItemsWrapper.querySelector(".active");
            if (activeDialogItem) activeDialogItem.classList.remove('active');

            target.classList.add('active');
            messagesWrapper.innerHTML = '';

            const { dialogId } = target.dataset;
            const { messages } = await api.getMessagesByDialogId(dialogId);

            for (let i = 0; i < messages.length; i++) {
                const message = messages[i];

                const isFirst = message.user1 !== messages[i - 1]?.user1;
                const isCompanion = message.user1 !== user.email;
                const messageItem = newMessage(
                    message.content,
                    isFirst,
                    isCompanion
                );

                messagesWrapper.append(messageItem);
            }
            scrollMessagesDown();
        }
    });

    sendButton.addEventListener('click', async event => {
        const prevMessage = messagesWrapper.querySelector(
            ".message:last-child"
        );
        const activeDialogItem = dialogItemsWrapper.querySelector('.active');
        const { dialogId } = activeDialogItem.dataset;

        const user1 = user.email;
        const content = inputText.value;
        const { result } = await api.createMessage({
            user1,
            dialogId,
            content,
        });

        const { message } = await api.getLastMessageByDialogId(dialogId);
        const isFirst =
            !prevMessage || prevMessage.classList.contains("companion-message");
        const isCompanion = false;

        const messageItem = newMessage(message.content, isFirst, isCompanion);
        messagesWrapper.append(messageItem);

        inputText.value = '';

        scrollMessagesDown();
    });
});
