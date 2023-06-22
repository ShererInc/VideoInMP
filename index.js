// ==UserScript==
// @name                Video In MP
// @name:zh-CN          公众号视频
// @name:ug             سالوندىكى فىلىم
// @namespace           Sherer
// @version             0.0.1
// @author              Sherer(شەرەر)
// @description         Easy to get video ids(wxv) in WeChat Official Accounts Platform.
// @description:zh-CN   一键获取公众号视频的ID（wxv）
// @description:ug      سالوندىكى فىلىملەرنىڭ نومۇرىغا (wxv) ئاسان ئېرىشىش ئۈچۈن ئىشلىتىلىدۇ
// @license             MIT
// @supportURL          https://github.com/ShererInc/VideoInMP
// @match               *://mp.weixin.qq.com/*
// @require             https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require             https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @run-at              document-idle
// @grant               GM_setClipboard
// @grant               GM_xmlhttpRequest
// @icon                https://www.ixinchuang.com/image/logo_new.png
// ==/UserScript==

(function () {
    'use strict';

    // global variables
    const lang = navigator.language || navigator.userLanguage; // e.g. "en-US"

    // Language pack
    const languages = {
        'zh-CN': {
            copyed: '内容已复制',
        },
        'ug': {
            dir: 'rtl',
            copyed: 'ئۇچۇر كۆچۈرۈلدى',
        },
        'default': {
            dir: 'ltr',
            copyed: 'content has been copied',
        },
    };

    // Use i18n
    let tc = (key, locale = lang) => {
        if (languages[locale] && languages[locale][key]) {
            return languages[locale][key];
        } else if (languages['default'] && languages['default'][key]) {
            return languages['default'][key];
        } else {
            return key;
        }
    };

    // Toast
    let toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: false,
        customClass: {
            container: `${tc('dir')} sherer-font`,
        },
    });

    // Useful toast
    const message = {
        success: (text) => {
            toast.fire({ title: text, icon: 'success' });
        },
        error: (text) => {
            toast.fire({ title: text, icon: 'error' });
        },
        warning: (text) => {
            toast.fire({ title: text, icon: 'warning' });
        },
        info: (text) => {
            toast.fire({ title: text, icon: 'info' });
        },
        question: (text) => {
            toast.fire({ title: text, icon: 'question' });
        }
    };

    // Add style
    let style = document.createElement('style');
    style.innerHTML = `
        .ltr { direction: ltr !important; }
        .rtl { direction: rtl !important; }
        .sherer-wxv-td { cursor: pointer; background-color: #f5f5f5; padding: 5px 8px; border-radius: 3px; white-space: nowrap; }
        .sherer-wxv-td:hover { background-color: #e9e9e9; }
        .sherer-font { font-family: 'UKIJ Ekran', 'UKIJ Tor', 'UKIJ Basma', 'ALKATIP Tor', 'ALKATIP', 'Microsoft YaHei', '微软雅黑', 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif !important; }
    `;
    document.head.appendChild(style);

    // Main function
    const run = (list) => {
        if (!list || !list.length) { return; }

        // Insert wxv field in thead
        let th = $(`<th class="sherer-wxv-th tc">wxv</th>`);
        if (!$('.sherer-wxv-th').length) { $('.weui-desktop-table__hd').find('th').eq(0).after(th); }

        // Insert wxv field in tbody
        if ($('.sherer-wxv-td').length) { return; }
        $('.weui-desktop-table__bd').find('tr').each(function (index) {
            let tr = $(this);
            let check = tr.find('.weui-desktop-simple-video__name-td');
            if (!check.length) { return; }
            let wxv = list[index].content;
            let td = $(`<td><span class="sherer-wxv-td">${wxv}</span></td>`);
            tr.find('td').eq(0).after(td);
        });

        // Set title field font
        $('.weui-desktop-simple-video__title').addClass('sherer-font');

        // Add click event for wxv field of copy content
        $('.sherer-wxv-td').on('click', function () {
            let wxv = $(this).text();
            GM_setClipboard(wxv, 'text');
            message.success(tc('copyed'));
        });
    };

    // Run
    run((window?.wx?.cgiData || wx?.cgiData || {}).item);
})();