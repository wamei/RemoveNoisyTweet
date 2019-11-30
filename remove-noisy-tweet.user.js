// ==UserScript==
// @name         Remove Noisy Tweet
// @namespace    http://wamei.jp/
// @version      0.2
// @author       wamei
// @match        https://tweetdeck.twitter.com/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    class _Util {
        onElementInserted(selector, callback) {
            if (!this.elementInsertedSelector) {
                this.elementInsertedSelector = {};
            }
            if (!this.elementInsertedSelector[selector]) {
                this.elementInsertedSelector[selector] = [];
                if (!window.elementInsertedSelectorCount) {
                    window.elementInsertedSelectorCount = 0;
                }
                const count = ++window.elementInsertedSelectorCount;

                const style1 = document.createElement('style');
                style1.innerHTML = `@-webkit-keyframes elementInserted${count} { 0% {opacity: 0;} 100% {opacity: 1;} }`;
                document.querySelector('head').appendChild(style1);

                const style2 = document.createElement('style');
                style2.innerHTML = `${selector} { -webkit-animation: elementInserted${count} 0.001s 1; }`;
                document.querySelector('head').appendChild(style2);

                document.addEventListener('webkitAnimationStart', (event) => {
                    if (event.animationName == `elementInserted${count}`) {
                        this.elementInsertedSelector[selector].forEach((callback) => {
                            callback(event.target);
                        });
                    }
                });
            }
            this.elementInsertedSelector[selector].push(callback);
        }
    }
    const Util = new _Util();

    class _Settings {
        constructor () {
           this.saveKey = 'wrnt';
           this.tweetSelector = 'article.stream-item';
           this.style = document.createElement('style');
           this.style.innerHTML = `
.wrnt-settings button {
  margin-right: 10px;
}
.wrnt-settings {
  margin: 50px;
  padding: 50px;
  border: 1px solid #aaa;
  background-color: #fff;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 9999;
  text-align: right;
}
.wrnt-hide {
  display: none;
}
.wrnt-hide-tweet {
  display: none;
}
.wrnt-textarea {
  overflow-y: scroll;
  height: 90%;
  margin-bottom: 20px;
}
.wrnt-textarea > div {
  position: relative;
  text-align: left;
}
.wrnt-textarea textarea {
  border: 1px solid #1da1f2 !important;
  margin: 10px 0;
  background-color: #fff !important;
  color: #000 !important;
  margin-left: 40px;
  width: 90% !important;
  resize: both !important;
}
.wrnt-close{
  position: absolute;
  left: 0;
  top: 0;
  display:inline-block;
  width:32px;
  height:32px;
  border:0;
  background-color:black;
  border-radius:32px;
  margin:0;
  padding:0;
  transform:scale(0.5);
  cursor:pointer;
}
.wrnt-close:before{
  content:"";
  position:absolute;
  display:inline-block;
  top:4px;
  left:13px;
  width:6px;
  height:24px;
  border:0;
  margin:0;
  padding:0;
  background-color:white;
  -moz-transform:rotate(45deg);
  -webkit-transform:rotate(45deg);
  transform:rotate(45deg);
}
.wrnt-close:after{
  content:"";
  position:absolute;
  display:inline-block;
  top:4px;
  left:13px;
  width:6px;
  height:24px;
  border:0;
  margin:0;
  padding:0;
  background-color:white;
  -moz-transform:rotate(-45deg);
  -webkit-transform:rotate(-45deg);
  transform:rotate(-45deg);
}
.wrnt-close:hover{
  background-color:#aaa;
}
`;
            document.head.appendChild(this.style);

            this.element = document.createElement('div');
            this.element.classList.add('wrnt-settings');

            this.itemsAreaElement = document.createElement('div');
            this.itemsAreaElement.classList.add('wrnt-textarea');
            this.element.appendChild(this.itemsAreaElement);

            const addButton = document.createElement('button');
            addButton.innerHTML = `Add`;
            addButton.addEventListener('click', () => {
                this.addItemElement('');
            });
            this.element.appendChild(addButton);

            const importButton = document.createElement('button');
            importButton.innerHTML = `Import`;
            importButton.addEventListener('click', () => {
                const ret = prompt('Import', '');
                if (ret != null && ret != '') {
                    this.load(ret);
                }
            });
            this.element.appendChild(importButton);

            const exportButton = document.createElement('button');
            exportButton.innerHTML = `Export`;
            exportButton.addEventListener('click', () => {
                prompt('Export', this.stringify());
            });
            this.element.appendChild(exportButton);

            const saveButton = document.createElement('button');
            saveButton.innerHTML = `Save on close`;
            saveButton.addEventListener('click', () => {
                this.save();
                this.hide();
            });
            this.element.appendChild(saveButton);

            const closeButton = document.createElement('button');
            closeButton.innerHTML = `Close`;
            closeButton.addEventListener('click', () => {
                this.hide();
            });
            this.element.appendChild(closeButton);

            document.body.appendChild(this.element);
            this.hide();
        }

        addItemElement(text) {
            const div = document.createElement('div');

            const textarea = document.createElement('textarea');
            textarea.innerHTML = text;

            const close = document.createElement('div');
            close.classList.add('wrnt-close');
            close.addEventListener('click', () => {
                div.remove();
            });

            div.appendChild(textarea);
            div.appendChild(close);
            this.itemsAreaElement.insertBefore(div, this.itemsAreaElement.firstElementChild);
        }

        stringify() {
            return JSON.stringify(this.data);
        }

        load(data) {
            if (!data || data == '') {
                data = localStorage.getItem(this.saveKey);
            }
            if (!data) {
                this.data = {};
            } else {
                this.data = JSON.parse(data);
            }
            if (!this.data.items) {
                this.data.items = [''];
            }
            this.itemsAreaElement.innerHTML = '';
            this.data.items.reverse().forEach((text) => {
                this.addItemElement(text);
            });
        }

        save() {
            const items = [];
            this.itemsAreaElement.querySelectorAll('textarea').forEach(e => {
                items.push(e.value);
            });
            this.data.items = items;
            localStorage.setItem(this.saveKey, this.stringify());

            document.querySelectorAll('.wrnt-hide-tweet').forEach((target) => {
                target.classList.remove('wrnt-hide-tweet');
            });
            document.querySelectorAll(this.tweetSelector).forEach((target) => {
                this.removeTweet(target);
            });
        }

        show() {
            this.load();
            this.element.classList.remove('wrnt-hide');
        }

        hide() {
            this.load();
            this.element.classList.add('wrnt-hide');
        }

        removeTweet(target) {
            this.data.items.forEach((keyword) => {
                if (keyword == '') {
                    return;
                }
                const match = keyword.match(new RegExp('^/(.+)/([gimsuy]*)$'));
                if (match) {
                    if (!new RegExp(match[1], match[2]).test(target.innerHTML)) {
                        return;
                    }
                } else if (!target.innerHTML.includes(keyword)) {
                    return;
                }
                target.classList.add('wrnt-hide-tweet');
            });
        }
    }
    const Settings = new _Settings();

    Util.onElementInserted(Settings.tweetSelector, (target) => {
        Settings.removeTweet(target);
    });

    Util.onElementInserted('.js-dropdown-content', (target) => {
        const menu = document.createElement('li');
        menu.classList.add('is-selectable');
        menu.addEventListener('mouseover', () => {
            menu.classList.add('is-selected');
        });
        menu.addEventListener('mouseleave', () => {
            menu.classList.remove('is-selected');
        });

        const link = document.createElement('a');
        link.dataset.action = 'wrnt-settings';
        link.innerHTML = `Remove Noisy Tweet`;
        link.addEventListener('click', () => {
            Settings.show();
        });
        menu.appendChild(link);

        const ul = target.querySelector('ul');
        const div = document.createElement('li');
        div.classList.add('drp-h-divider');
        ul.appendChild(div);
        ul.appendChild(menu);
    });
})();
