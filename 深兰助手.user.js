// ==UserScript==
// @name         深兰网课助手增强版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  隐藏弹幕，并通过空格键控制 iframe 内外的视频播放和暂停，左右箭头键控制快进和后退，无论视频是否全屏或被点击。
// @author       dalvqw
// @match        *://*.aijdjy.com/course/*/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏弹幕
    GM_addStyle(`
        .bullet-screen {
            display: none !important;
        }
    `);

    // 控制视频播放
    function controlVideo(e) {
        // 避免在输入时触发快捷键
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            return;
        }

        // 尝试找到当前激活的视频元素，考虑全屏状态
        var video = document.querySelector('video:active, video:focus') ||
                    document.querySelector('iframe')?.contentDocument?.querySelector('video') ||
                    document.querySelector('video');

        if (!video) return; // 没有找到视频直接返回

        switch(e.code) {
            case 'Space':
                e.preventDefault(); // 阻止空格键的默认行为
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
                break;
            case 'ArrowLeft':
                e.preventDefault(); // 视频后退5秒
                video.currentTime = Math.max(0, video.currentTime - 5);
                break;
            case 'ArrowRight':
                e.preventDefault(); // 视频快进5秒
                video.currentTime = Math.min(video.duration, video.currentTime + 5);
                break;
        }
    }

    // 全局监听按键事件
    document.addEventListener('keydown', controlVideo, true);
})();