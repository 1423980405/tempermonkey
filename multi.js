// ==UserScript==
// @name         🌟适合【2025国家智慧教育平台寒假研修】【河北继续教育-师学通 | 中国教育电视台(2024中小学) | 奥鹏 | 高等教育出版社(2024中小学)】无人值守/极速刷课
// @namespace    http://tampermonkey.net/zzzzzzys_国家中小学
// @version      2.2.1
// @copyright    zzzzzzys.All Rights Reserved.
// @description  适用2025国家智慧教育平台、河北继续教育【师学通、2024中小学、奥鹏】.✅ 中小学/师范生：课程目录页秒刷视频🚀 职业教育/高等教育：三倍速自动挂机播放💎师学通全自动支持：课程连刷 | 防暂停 | 验证码破解💎2024中小学全自动支持/秒学💎奥鹏全自动 【新增】高等教育出版社(2024中小学) 全自动/秒学📢 注意：禁止二次发布！加QQ群获取更新
// @author       zzzzzzys
// @match        https://basic.smartedu.cn/*
// @match        https://core.teacher.vocational.smartedu.cn/*
// @match        https://test3.ykt.eduyun.cn/*
// @match        https://pn202413060.stu.teacher.com.cn/studyPlan/*
// @match        https://pn202413060.stu.teacher.com.cn/course/*
// @match        https://cn202511002.stu.t-px.cn/*
// @match        http://cas.study.yanxiu.jsyxsq.com/auth/selfHost/studyPlace/index.html*
// @match        https://learn.ourteacher.com.cn/StepLearn/StepLearn/*
// @match        https://vc.chinabett.com/studyduration/index*
// @require      https://fastly.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js
// @resource     https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.min.css
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @connect      basic.smartedu.cn
// @connect      x-study-record-api.ykt.eduyun.cn
// @connect      fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com
// @connect      mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==
// 请勿搬运代码
class ScriptCore {
    constructor() {
        this.modules  = new Map();
        this.initModules();
        this.execute();
    }

    initModules() {
        // 多站点匹配配置
        this.modules.set('国家智慧教育平台',  {
            match: [
                /^(https?:\/\/)?(basic\.smartedu\.cn)/,
                /^(https?:\/\/)?(core\.teacher\.vocational\.smartedu\.cn)/,
                /^(https?:\/\/)?(test3\.ykt\.eduyun\.cn)/,
                /localhost:\d+(\/.*)?$/ // 本地开发环境
            ],
            module: SmartEduModule,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});

        this.modules.set('师学通平台',  {
            match: url => {
                const targetPaths = [
                    '/studyPlan/',
                    '/course/'
                ];
                // 正确的主机名验证
                const validHost = 'pn202413060.stu.teacher.com.cn';
                const isHostMatch = url.hostname  === validHost;

                // 路径双重验证
                const isPathMatch = targetPaths.some(path  =>
                    url.pathname.startsWith(path)
                );

                return isHostMatch && isPathMatch;
            },
            module: TeacherModule,
            config: { debugMode: false }
        });
        this.modules.set('中国教育电视台',  {
            match: [
                /^(https?:\/\/)?(cas\.study\.yanxiu\.jsyxsq\.com\/auth\/selfHost\/studyPlace\/index.html)/,
                /localhost:\d+(\/.*)?$/
            ],
            module: HebeiCas,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('奥鹏',  {
            match: [
                /^(https?:\/\/)?(learn\.ourteacher\.com\.cn\/StepLearn\/StepLearn)/,
                /localhost:\d+(\/.*)?$/
            ],
            module: HebeiAoPeng,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('高等教育出版社-2024中小学',  {
            match: [
                /^(https?:\/\/)?(vc\.chinabett\.com\/studyduration\/index)/,
                /localhost:\d+(\/.*)?$/
            ],
            module: Chinabett,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
    }

    execute() {
        const currentUrl = new URL(window.location.href);

        for (const [moduleName, { match, module: Module, config }] of this.modules)  {
            if (this.matchChecker(currentUrl,  match)) {
                Logger.moduleLoaded(moduleName)
                new Module().run(config);
                return; // 单例模式运行
            }
        }
        console.warn('[Core]  未找到匹配模块');
    }
    matchChecker(currentUrl, matcher) {
        // 处理多种匹配类型
        if (Array.isArray(matcher))  {
            return matcher.some(pattern  =>
                pattern instanceof RegExp ? pattern.test(currentUrl.href)
                    : typeof pattern === 'function' ? pattern(currentUrl)
                        : false
            );
        }
        return typeof matcher === 'function'
            ? matcher(currentUrl)
            : matcher.test(currentUrl.href);
    }
}
class Logger {
    static #styles = {
        core: ['font-size: 11px', 'font-family: monospace', 'padding: 2px 8px', 'border-radius: 4px', 'background: linear-gradient(145deg, #2196F3 20%, #1976D2)', 'color: white', 'text-shadow: 0 1px 1px rgba(0,0,0,0.3)'].join(';'),
        module: ['background: #FFEB3B', 'color: #212121', 'padding: 1px 4px', 'border-radius: 2px', 'margin-left: 4px'].join(';'),
        status: ['background: #4CAF50', 'color: white', 'padding: 1px 6px', 'border-left: 2px solid #388E3C'].join(';')
    };
    static moduleLoaded(name) {
        const timestamp = performance.now().toFixed(2);
        try {
            Swal.fire({title: "脚本加载成功！", text: "脚本已正确加载！", icon: 'success', confirmButtonColor: "#FF4DAFFF", confirmButtonText: "关闭", timer: 2000,})
        }catch (e) {
            console.error(e);
        }
        console.log(
            `%cCORE%c${name}%c ✔ LOADED %c+${timestamp}ms`,
            this.#styles.core,
            this.#styles.module,
            this.#styles.status,
            'color: #757575; font-size: 0.8em;'
        );}}
class SmartEduModule {
    constructor() {
    }
    run(config) {
        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        /*****************************
         * 盗版可耻
         * 请尊重原创劳动成果！
         * 作者：zzzzzzys
         * https://cn-greasyfork.org/zh-CN/users/1176747-zzzzzzys
         * 搬运可耻
         ****************************/
        const qqGroup = [{customName: "群1", id: "570337037", link: "https://qm.qq.com/q/rDCbvTiV9K", isFull: true, priority: 0}, {customName: "群2", id: "618010974", link: "https://qm.qq.com/q/h854sxDvKa", isFull: true, priority: 1}, {customName: "群3", id: "1003884618", link: "https://qm.qq.com/q/kRcyAunAic", isFull: true, priority: 2}, {customName: "群4", id: "821240605", link: "https://qm.qq.com/q/z1ogtdhyGA", isFull: false, priority: 3}, {customName: "群5", id: "1013973135", link: "https://qm.qq.com/q/EpXA5Ar3vG", isFull: true, priority: 4}, {customName: "交流学习群（禁广告，只交流学习）", id: "978762026", link: "https://qm.qq.com/q/aUTUVmKYQE", isFull: true, priority: 5},{customName: "交流学习群2（禁广告，只交流学习）", id: "992947190", link: "https://qm.qq.com/q/Egvc0YJM8S", isFull: false, priority: 0}]
        let biliUrl = "https://b23.tv/x5pFcB0"
        const originalXHR = unsafeWindow.XMLHttpRequest;
        let fullDatas = null
        unsafeWindow.XMLHttpRequest = function () {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            const originalSend = xhr.send;
            xhr.open = function (method, url) {
                this._method = method;
                this._url = url;
                return originalOpen.apply(this, arguments);
            };
            xhr.send = function (body) {
                this.addEventListener('readystatechange', function () {
                    if (this._url.includes("fulls.json")) {
                        if (this.readyState === 4) { // 请求完成
                            console.log('捕获到 XHR 请求结果:', {
                                url: this._url, method: this._method, status: this.status, response: this.response
                            });
                            fullDatas = JSON.parse(this.response);
                        }}});
                return originalSend.apply(this, arguments);
            };
            return xhr;
        };
        const renderQQGroups = () => {
            try {
                const activeGroups = qqGroup
                    .filter(group => {
                        // 添加数据校验
                        if (!group.customName || !group.id) {
                            console.warn('Invalid group:', group);
                            return false;
                        }
                        return !group.isFull;
                    })
                    .sort((a, b) => a.priority - b.priority);

                // 添加空状态提示
                if (activeGroups.length === 0) {
                    return `<div style="color: #ff9999; text-align:center; margin:12px 0">
              所有群组已开放，欢迎直接加入
            </div>`;
                }
                const title = `<div style="background: linear-gradient(135deg, #FF4DAF 0%, #FF6B6B 100%);display: flex; align-items: center; gap:15px;"> <img src="https://qzonestyle.gtimg.cn/qzone/qzact/act/external/tiqq/logo.png" style="height:36px; border-radius:6px;"> <div> <div style="font-size:16px; font-weight:bold; margin-bottom:4px;">教师交流群(请优先选择未满群加入)</div> <div style="font-size:12px; opacity:0.9;">获取实时支持 | 最新功能优先体验</div> </div> </div>`
                let content = title + activeGroups.map(group => ` <a href="${group.link}" target="_blank" style="display: block; margin-top: 12px; padding: 10px; background: rgba(255,255,255,0.2); border-radius: 6px; text-align: center; text-decoration: none; color: white !important; transition: 0.3s; font-weight: 500; cursor: pointer;" aria-label="加入QQ群${group.customName}（群号：${group.id}）"> 🎯 点击加入${group.customName}:${group.id} <!-- 移除群号显示 --> </a> `).join('');
                return `<div style="background: linear-gradient(135deg, #FF4DAF 0%, #FF6B6B 100%); padding:15px; border-radius:8px; color:white;">
                                    ${content}
                                </div>`
            } catch (error) {
                console.error('QQ群渲染错误:', error);
                return ''; // 静默失败
            }
        };
        let requestObj = {
            fullsData: {
                url: "https://s-file-2.ykt.cbern.com.cn/teach/s_course/v2/activity_sets/3efdb592-138e-4854-8964-5e10f6011f33/fulls.json",
                method: "GET",
            }, resourceLearningPositions: {
                url: "https://x-study-record-api.ykt.eduyun.cn/v1/resource_learning_positions/", method: "PUT"
            }, /* 职业教育 | 高等教育  */
            progress: {
                url: "https://core.teacher.vocational.smartedu.cn/p/course/services/member/study/progress",
                method: "POST",
            }
        }
        /********************************************************
         * 职业教育/高等教育
         *******************************************************/
        const SWAL_CONFIG = {
            title: '课程进度控制', html: ` <div style="margin-bottom: 5px"> <label>v${GM_info.script.version}</label> </div> <div style=" padding: 12px; background: #e8f4ff; border-radius: 8px; margin-bottom: 15px; border: 1px solid #b3d4fc; text-align: center; "> <span style=" font-size: 14px; color: #ff4daf; display: inline-flex; align-items: center; gap: 6px; "> <span style="font-size: 16px">🎯</span> 老师您好，点击开始按钮，开始减负之旅<br> 脚本会自动学习当前页所有视频，您可安心休息片刻 </span> </div> <div style="margin-bottom: 15px"> <label>当前视频：</label> <div id="currentVideo" style=" font-size: 16px; color: #3498db; font-weight: 500; margin: 8px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">尚未开始</div> </div> <div class="progress-container" style=" background: #f0f0f0; height: 20px; border-radius: 10px; margin: 15px 0; overflow: hidden; "> <div id="swalProgressBar" style=" height: 100%; background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%); width: 0; transition: width 0.3s ease; "></div> </div> <div style=" display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; "> <div> <label>当前进度</label> <div id="currentProgress" style=" font-size: 18px; font-weight: bold; color: #2c3e50; ">0:00</div> </div> <div> <label>大概需要时间</label> <div id="needTime" style=" font-size: 14px; color: #2efd00; ">还未开始</div> </div> <div> <label>总时长</label> <div id="totalTime" style=" font-size: 14px; color: #7f8c8d; ">还未开始</div> </div> </div> <div id="statusMessage" style=" padding: 10px; border-radius: 5px; margin: 10px 0; background: #f8f9fa; text-align: center; ">准备就绪</div> <div style=" padding: 12px; background: #f5f7fa; border-radius: 8px; margin: 12px 0; border: 1px solid #e4e7ed; "> ${renderQQGroups()} </div> <div id="author" style=" padding: 8px 16px; /* 适当的上下左右内边距 */ border-radius: 10px; margin: 10px 0; background: #f8f9fa; text-align: center; font-size: 12px; /* 稍微增大字体 */ font-weight: bold; /* 加粗字体 */ color: #495057; /* 更深的字体颜色，增强可读性 */ border: 1px solid #dee2e6; /* 添加边框 */ box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 轻微阴影效果 */ letter-spacing: 1px; /* 增加字母间距 */ "> By YoungthZou. 盗码可耻！ zzzzzzys </div> `, showConfirmButton: false, allowOutsideClick: false, allowEscapeKey: false, width: 600, willOpen: () => {
                document.querySelector('.swal2-close').remove();
            }
        };
        // 状态管理
        let currentProgress = 60;
        let isRunning = false;
        let swalInstance = null;
        let totalTime = 1000;
        let checkInterval = null
        // 工具函数
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };
        const updateUI = (progress, status) => {
            if (!swalInstance) return;
            const progressBar = swalInstance.querySelector('#swalProgressBar');
            const percent = (progress / totalTime * 100).toFixed(1);
            progressBar.style.width = `${Math.min(parseFloat(percent), 100)}%`;
            swalInstance.querySelector('#currentProgress').textContent = formatTime(progress);
            swalInstance.querySelector('#totalTime').textContent = formatTime(totalTime);
            swalInstance.querySelector('#needTime').textContent = formatTime(parseInt(((totalTime - progress) / 3).toFixed(0)));
            const statusEl = swalInstance.querySelector('#statusMessage');
            statusEl.textContent = {loading: '🔄 正在同步进度...', success: '✅ 同步成功,stand by...', error: '❌ 同步失败(长时间失败，请反馈)', idle: '⏸ 已暂停', finished: '✅已学完，跳过...', finishAll: '已全部学完,请手动刷新，给个好评吧~', next: "🔄 此视频已学完，准备学习下一个..."}[status] || '准备就绪';
            statusEl.style.color = {loading: '#f39c12', success: '#2ecc71', error: '#e74c3c', idle: '#7f8c8d', finished: '#0022fd', finishAll: '#ff4daf', next: '#f39c12',}[status];
        };
        const sendProgress = async (videoId) => {
            updateUI(currentProgress, 'loading');
            let oriData = {
                courseId: unsafeWindow.courseId,
                itemId: unsafeWindow.p.itemId,
                videoId: videoId,
                playProgress: currentProgress,
                segId: unsafeWindow.p.segId,
                type: unsafeWindow.p.type,
                tjzj: 1,
                clockInDot: currentProgress,//后台要求此参数为视频播放的位置
                sourceId: unsafeWindow.p.projectId,
                timeLimit: unsafeWindow.timilistParam.timeLimit || -1,
                originP: unsafeWindow.p.originP === 1 ? 2 : 1,  // 硬编码，等待修改
            }
            try {
                const response = await fetch(`${requestObj.progress.url}?orgId=${unsafeWindow.p.orgId}`, {
                    method: "POST", headers: {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "x-requested-with": "XMLHttpRequest",
                        "u-platformId": unsafeWindow.platformInfo.id
                    }, credentials: "include", body: new URLSearchParams(oriData)
                });
                const data = await response.json();
                console.log(data)
                if (data.data?.videoProgress > 0) {
                    currentProgress = parseInt(data.data.videoProgress);
                    updateUI(currentProgress, 'success');
                    return data.data.progress;
                } else {
                    throw new Error('无效的服务器响应');
                }
            } catch (error) {
                console.error('请求失败:', error);
                updateUI(currentProgress, 'error');
            }
        };
        // 创建控制界面
        function createControlPanel() {
            Swal.fire({
                ...SWAL_CONFIG, didOpen: (modal) => {
                    swalInstance = modal;
                    const actions = document.createElement('div');
                    actions.style = `display: grid;grid-template-columns: 1fr 1fr;gap: 10px;margin-top: 15px;`;
                    const startBtn = createButton('▶ 开始', '#2ecc71', async () => {
                        if (!isRunning) {
                            try {
                                try {
                                    document.querySelector('video').pause()
                                } catch (e) {}
                                isRunning = true;
                                startBtn.textContent = '⏸ 暂停';
                                startBtn.style.background = '#e74c3c';
                                let courseData = getCourseData();
                                for (const courseDatum of courseData) {
                                    if (!isRunning) {
                                        return
                                    }
                                    await sleep(2000)
                                    console.log(courseDatum.name)
                                    swalInstance.querySelector('#currentVideo').textContent = courseDatum.name
                                    currentProgress = 0;
                                    totalTime = parseInt(courseDatum.duration);
                                    if (parseInt(courseDatum.progress) === 1) {
                                        console.log(" 已学完，跳过...")
                                        updateUI(currentProgress, 'finished');
                                        continue;
                                    }
                                    do {
                                        const progress = await sendProgress(courseDatum.videoId, currentProgress); // 立即执行
                                        if (progress === "1.0") {
                                            break;
                                        }
                                        await interruptibleWait(21000);
                                    } while (currentProgress < totalTime && isRunning)
                                    updateUI(currentProgress, 'next');
                                    await sleep(20000);
                                }
                                // 非暂停结束
                                if (isRunning) {
                                    currentProgress = 1;
                                    totalTime = 1;
                                    updateUI(currentProgress, 'finishAll');
                                    startBtn.textContent = '▶ 开始';
                                    startBtn.style.background = '#2ecc71';
                                }
                            } catch (e) {
                                console.error(e)
                                if (Swal) {
                                    Swal.fire({
                                        title: "失败！",
                                        text: e.toString() + "请在视频播放页面使用！！！",
                                        icon: 'error', // showCancelButton: true,
                                        confirmButtonColor: "#FF4DAFFF", // cancelButtonText: "取消，等会刷新",
                                        confirmButtonText: "点击去反馈",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            window.open("https://greasyfork.org/zh-CN/scripts/525037/feedback")
                                        }
                                    });
                                }
                            } finally {
                                isRunning = false;
                            }
                        } else {
                            isRunning = false;
                            startBtn.textContent = '▶ 继续';
                            startBtn.style.background = '#2ecc71';
                            if (checkInterval) {
                                clearTimeout(checkInterval.timer);
                                checkInterval.resolve(); // 立即结束等待
                            }
                            updateUI(currentProgress, 'idle');
                            setTimeout(() => {
                                updateUI(currentProgress, 'idle');
                            }, 2000)
                        }
                    });
                    const resetBtn = createButton('→去好评', '#dbba34', () => {
                        window.open("https://greasyfork.org/zh-CN/scripts/525037/feedback")
                    });
                    actions.append(startBtn, resetBtn);
                    modal.querySelector('.swal2-html-container').append(actions);
                }
            });
        }
        const sleep = function (time) {
            return new Promise(resolve => setTimeout(resolve, time));
        }
        function interruptibleWait(ms) {
            return new Promise(resolve => {
                const timer = setTimeout(resolve, ms);
                // 暴露清除方法以便立即暂停
                checkInterval = {timer, resolve};
            });
        }
        function createButton(text, color, onClick) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style = `padding: 10px 15px;border: none;border-radius: 5px;background: ${color};color: white;cursor: pointer;transition: opacity 0.3s;`;
            btn.addEventListener('click', onClick);
            btn.addEventListener('mouseenter', () => btn.style.opacity = 0.8);
            btn.addEventListener('mouseleave', () => btn.style.opacity = 1);
            return btn;
        }
        function getCourseData() {
            let courseData = unsafeWindow.initlessons
            console.log(courseData)
            if (!courseData) {
                updateUI(currentProgress, 'error');
                console.error("no course data!");
                return
            }
            courseData = courseData.filter(item => {
                return item?.type !== "1";
            });
            return [...courseData];
        }
        /********************************************************
         * 打赏
         *******************************************************/
        GM_addStyle(`.donate-panel { position: fixed; left: 30%; top:50%; background: linear-gradient(135deg, #fff5f5 0%, #fff0f7 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(255, 77, 175, 0.2); padding: 24px; width: 520px; z-index: 2147483647; transform: translateY(-100); /* 初始隐藏位置 */ opacity: 1; /* 确保初始可见性 */ border: 1px solid #ffe6f0; backdrop-filter: blur(8px); transition: none; /* 禁用transition改用animation */ }.donate-header { position: relative; font-size: 18px; color: #ff4daf; margin-bottom: 20px; font-weight: 600; display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 2px solid rgba(255, 77, 175, 0.1); } .donate-header::after { content: "✨"; position: absolute; right: 0; top: -8px; font-size: 24px; animation: sparkle 2s infinite; } .motivation-text { font-size: 13px; color: #666; line-height: 1.6; margin: 12px 0; background: rgba(255, 255, 255, 0.9); padding: 12px; border-radius: 8px; border: 1px solid #ffebf3; } @keyframes heartbeat { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } } @keyframes sparkle { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } } @keyframes panelSlideIn { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(-50%); opacity: 1; } } @keyframes panelSlideOut { from { transform: translateY(0); opacity: 1; } to { transform: translateY(100%); opacity: 0; } } @keyframes heartbeat { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } } .qr-grid { display: grid; grid-template-columns: 1fr; /* 改为单列布局 */ gap: 24px; margin: 24px auto; max-width: 300px; /* 增大容器宽度 */ } .qr-item { position: relative; overflow: hidden; border-radius: 12px; transition: 0.3s; padding: 12px; /* 增加内边距 */ background: #fff; box-shadow: 0 4px 12px rgba(255, 77, 175, 0.1); } .qr-item:hover { transform: translateY(-4px); box-shadow: 0 6px 16px rgba(255, 77, 175, 0.2); } .qr-item img { width: 100%; height: auto; /* 保持比例 */ border-radius: 8px; border: 1px solid #ffe5f0; min-height: 280px; /* 最小高度保证 */ } .qr-item p { text-align: center; margin: 16px 0 8px; font-size: 16px; /* 增大文字 */ color: #ff4daf; font-weight: 600; } /* 新增文字样式 */ .qr-tips { text-align: center; margin: 8px 0; font-size: 14px; color: #ff7ab8; /* 更柔和的粉色 */ } .qr-proverb { font-style: italic; color: #ff9ec7; /* 更浅的粉色 */ font-size: 13px; margin-top: 4px; } /* 修改原有.qr-item p样式 */ .qr-item p { margin: 12px 0 4px; /* 减小下边距 */ /* 其他样式保持不变 */ } /* 手机横屏/平板适配 */ @media (min-width: 600px) { .qr-grid { grid-template-columns: 1fr 1fr; /* 大屏幕恢复双列 */ max-width: 600px; } .qr-item img { min-height: 240px; } } .third-party { margin-top: 20px; } .platform-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: linear-gradient(135deg, #fff0f5 0%, #fff8fb 100%); border-radius: 8px; text-decoration: none; color: #ff6699 !important; font-size: 14px; margin: 8px 0; transition: 0.3s; border: 1px solid #ffe6ee; } .donate-panel.active { animation: panelSlideIn 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) forwards; } .donate-panel.exit { animation: panelSlideOut 0.3s ease forwards; } /* 触发按钮动画 */ #donate-trigger { animation: heartbeat 1.8s ease-in-out infinite; } .platform-btn:hover { background: linear-gradient(135deg, #ffe6ee 0%, #fff1f7 100%); box-shadow: 0 4px 12px rgba(255, 77, 175, 0.1); } .close-btn { /* 保持原有样式 */ }`);

        // 激励文案库
        const motivationTexts = ["您的每一份支持都将转化为：", "❤️ 服务器续费 ", "🛠️ 持续开发维护 ", "☕ 深夜码农的咖啡燃料", "🐈 小猫最爱的水煮鸡胸肉",];

        // 动态生成激励文案
        function generateMotivation() {
            const fragments = ['<div class="motivation-text">', '🌟 <strong>感谢使用本脚本！</strong>', ...motivationTexts.map(t => `• ${t}`), '</div>'].join('<br>');
            return fragments
                .replace('${donateCount}', '1,234')
                .replace('${updateDays}', '365');
        }
        // 打赏面板HTML结构
        const donateHTML = `
<div  id="donate-panel"> ${generateMotivation()} <div class="donate-header"> <svg viewBox="0 0 24 24" width="20" height="20" fill="#1e62ec"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/> </svg> 支持开发者 </div> <div class="qr-grid"> <div class="qr-item"> <p>微信扫码支持</p> <img style="width: 200px;height: 266px" src="https://mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.cdn.bspapp.com/monkey-pic/wechat3.jpg" alt="微信赞赏码"> <div class="qr-tips"> <p>❤️持续创作需要您的支持</p> <p class="qr-proverb">星火相聚，终成光芒</p> </div> </div> <div class="qr-item"> <p>支付宝扫码支持</p> <img style="width: 200px;height: 266px" src="https://mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.cdn.bspapp.com/monkey-pic/alipay2.jpg" alt="支付宝收款码"> <div class="qr-tips"> <p>🌸每一份心意都值得珍惜</p> <p class="qr-proverb">不啻微芒，造矩成阳</p> </div> </div> </div> <div class="donate-header"> <svg viewBox="0 0 24 24" width="20" height="20" fill="#1e62ec"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/> </svg> 感谢您的支持！ </div> <div class="third-party"> <!--<a href="https://afdian.net/@yourid" class="platform-btn" target="_blank"> <svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align:-2px;"> <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm218-572.1h-50.4c-4.4 0-8 3.6-8 8v384.2c0 4.4 3.6 8 8 8h145.7c4.4 0 8-3.6 8-8V319.9c0-4.4-3.6-8-8-8h-50.4c-4.4 0-8 3.6-8 8v151.7H730V319.9c0-4.4-3.6-8-8-8zM328.1 703.9c-4.4 0-8-3.6-8-8v-384c0-4.4 3.6-8 8-8h50.4c4.4 0 8 3.6 8 8v151.7h116.7V319.9c0-4.4 3.6-8 8-8h50.4c4.4 0 8 3.6 8 8v384.2c0 4.4-3.6 8-8 8h-145c-4.4 0-8-3.6-8-8v-151H344v151c0 4.4-3.6 8-8 8H328.1z"/> </svg> 爱发电支持 </a>--> <div class="platform-btn" id="donate-panel-close">感谢开发者，已支持~</div> </div> </div>
`;

        // 初始化打赏面板
        function initDonate() {
            if (document.getElementById('donate-panel')) return;
            const panel = document.createElement('div');
            panel.innerHTML = donateHTML;
            panel.className = 'donate-panel';
            document.body.appendChild(panel);
            // 强制重排触发动画
            void panel.offsetWidth; // 触发CSS重绘
            panel.classList.add('active');
            // 关闭按钮事件
            panel.querySelector('#donate-panel-close').addEventListener('click', () => {
                panel.classList.remove('active');
                panel.classList.add('exit');
                panel.addEventListener('animationend', () => {
                    panel.remove();
                }, {once: true});
            });
            // 点击外部关闭
            const clickHandler = (e) => {
                if (!panel.contains(e.target) && e.target.id !== 'donate-trigger') {
                    panel.classList.add('exit');
                    panel.addEventListener('animationend', () => {
                        panel.remove();
                    }, {once: true});
                    document.removeEventListener('click', clickHandler);
                }
            };
            setTimeout(() => document.addEventListener('click', clickHandler), 100);
        }

        // 显示触发按钮
        const trigger = document.createElement('div');
        trigger.innerHTML = '❤️ 打赏支持';
        Object.assign(trigger.style, {
            position: 'fixed', left: '10px', top: '415px', background: '#ff6b6b', color: 'white', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', zIndex: '999999999999999', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', fontSize: '14px'
        });
        // 触发按钮增强
        Object.assign(trigger.style, {
            background: 'linear-gradient(135deg, #ff4daf 0%, #ff6b6b 100%)', fontWeight: '600', padding: '12px 24px', boxShadow: '0 4px 24px rgba(255, 77, 175, 0.3)', animation: 'heartbeat 1.5s ease-in-out infinite', border: '1px solid #ffb3d9'
        });
        trigger.addEventListener('click', initDonate);
        document.body.appendChild(trigger);
        /********************************************************
         * 中小学智慧教育平台 * 寒假研修
         *******************************************************/
            //样式
        let style = `.button-3 { position: fixed; appearance: none; background-color: #ed5822; border: 1px solid rgba(27, 31, 35, .15); border-radius: 6px; box-shadow: rgba(27, 31, 35, .1) 0 1px 0; box-sizing: border-box; color: #ffffff; cursor: pointer; display: inline-block; font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"; font-size: 14px; font-weight: 600; line-height: 20px; padding: 6px 16px; left: 20px; top: 300px; text-align: center; text-decoration: none; user-select: none; -webkit-user-select: none; touch-action: manipulation; vertical-align: middle; white-space: nowrap; z-index: 2147483647; } .button-3:focus:not(:focus-visible):not(.focus-visible) { box-shadow: none; outline: none; } .button-3:hover { background-color: #2c974b; } .button-3:focus { box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px; outline: none; } .button-3:disabled { background-color: #94d3a2; border-color: rgba(27, 31, 35, .1); color: rgba(255, 255, 255, .8); cursor: default; } .button-3:active { background-color: #298e46; box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset; }`
        const createFloatingButton = () => {
            // 如果按钮已存在则先移除旧实例
            const existingBtn = document.getElementById('zs-helper-btn');
            if (existingBtn) existingBtn.remove();
            // 直接创建按钮元素（去掉外层div嵌套）
            const btn = document.createElement('div');
            btn.id = 'zs-helper-btn'; // 确保唯一ID直接设置在元素上
            btn.style.cssText = ` position: fixed; left: 10px; top: 250px; transform: translateY(-50%); background: #ed5822; color: white; padding: 12px 24px; border-radius: 30px; cursor: pointer; box-shadow: 0 4px 12px rgba(255,77,175,0.3); z-index: 2147483647; /* 使用最大z-index值 */ transition: 0.3s; font-family: 'Microsoft Yahei', sans-serif; white-space: nowrap; display: flex; align-items: center; gap: 8px; `;
            // 添加内部HTML内容
            btn.innerHTML = `
        <svg style="width:18px;height:18px;fill:white;" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
        <span>使用指南</span>
    `;
            // 使用更可靠的事件监听方式
            const handleHover = () => {
                btn.style.transform = 'translateY(-50%) scale(1.05)';
                btn.style.boxShadow = '0 6px 16px rgba(255,77,175,0.4)';
            };
            const handleLeave = () => {
                btn.style.transform = 'translateY(-50%) scale(1)';
                btn.style.boxShadow = '0 4px 12px rgba(255,77,175,0.3)';
            };
            btn.addEventListener('mouseenter', handleHover);
            btn.addEventListener('mouseleave', handleLeave);
            btn.addEventListener('click', showGuideDialog);
            document.body.appendChild(btn);
            return btn;
        };
        // 显示操作指南弹窗
        const showGuideDialog = () => {
            if (Swal) {
                Swal.fire({title: `<span style="color: #FF4DAF; font-size:26px; display: flex; align-items: center; gap:8px;">📚 智能刷课指南 <div style="font-size:12px; color:#95a5a6; margin-left:auto;">v${GM_info.script.version}</div></span>`, html: ` <div style="text-align: left; max-width: 720px; line-height: 1.8;"> <!-- 操作步骤 --> <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;"> <div style="color: red; font-weight:500; margin-bottom:10px;"> 播放页面未正常生效请刷新页面！播放页面左侧无红色按钮请刷新页面！ </div> <div style="color: #2c3e50; font-weight:500; margin-bottom:10px;"> 🚀 极速操作流程<br> </div> <div style="display: grid; grid-template-columns: 32px 1fr; gap: 10px; align-items: center;"> <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">1</div> <div>进入2025研修课程播放页面 / 课程目录页面</div> <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">2</div> <div>直接点击相应按钮，等待操作完成后，刷新页面</div> <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">3</div> <div><span style="color:#FF4DAF; font-weight:bold">诶个点击视频，看完最后几秒，安全保留日志信息</span></div> </div> </div> <!-- 注意事项 --> <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom:20px;"> <div style="border-left: 3px solid #FF4DAF; padding-left:12px;"> <div style="color: #e74c3c; font-weight:500; margin-bottom:8px;">⚠️ 重要提醒</div> <ul style="margin:0; padding-left:18px; color:#7f8c8d; font-size:14px;"> <li>视频最后剩下5秒需要看完</li> <li>刷课时勿播放视频</li> <li>建议刷完全部视频再刷新，观看最后的几秒</li> </ul> </div> <div style="border-left: 3px solid #27ae60; padding-left:12px;"> <div style="color: #27ae60; font-weight:500; margin-bottom:8px;">💡 高效技巧</div> <ul style="margin:0; padding-left:18px; color:#7f8c8d; font-size:14px;"> <li>中小学，在目录或播放页。点击按钮直接开刷</li> <li>职业/高等，挂机即可，可最小化浏览器</li> </ul> </div> </div> ${renderQQGroups()} </div> `,
                    confirmButtonText: "已了解，开始减负之旅 →",
                    confirmButtonColor: "#FF4DAF",
                    showCancelButton: true,
                    cancelButtonText: "不在显示此窗口",
                    cancelButtonColor: "#95a5a6",
                    width: 760,
                    customClass: {
                        popup: 'animated pulse', title: 'swal-title-custom'
                    },
                    footer: '<div style="color:#bdc3c7; font-size:12px;">请合理使用本工具</div>'
                }).then((result) => {
                    // console.log(result);
                    // console.log(Swal.DismissReason.cancel);
                    if (result.dismiss === Swal.DismissReason.cancel) {
                        // 跳转到课程列表页或其他操作
                        localStorage.setItem('noMoreDialog', "ture")
                    }
                });
            }
        }
        // 初始化逻辑
        // 初始化逻辑优化
        const init = () => {
            // 创建悬浮按钮
            const floatBtn = createFloatingButton();
            // 添加防DOM清理监听（优化版）
            const observer = new MutationObserver(mutations => {
                if (!document.body.contains(floatBtn)) {
                    createFloatingButton();
                }
            });
            observer.observe(document.body, {childList: true});

            // 添加CSS保护
            const style = document.createElement('style');
            style.textContent = ` #zs-helper-btn { pointer-events: auto !important; opacity: 1 !important; visibility: visible !important; } #zs-helper-btn:hover { transform: translateY(-50%) scale(1.05) !important; } `;
            document.head.appendChild(style);
        };
        function getVideoTime() {
            return Math.round(document.querySelector('video').duration)
        }
        function getResourceIdFromFullData() {
            if (!fullDatas || fullDatas.nodes?.length === 0) {
                throw Error("can't get fullDatas!")
            }
            const result = [];
            // 递归遍历节点
            const traverse = (node) => {
                if (node.node_type === 'catalog' && node.child_nodes?.length > 0) {
                    // 如果是目录节点，继续遍历子节点
                    node.child_nodes.forEach(child => traverse(child));
                } else if (node.node_type === 'activity') {
                    // 如果是活动节点，提取资源
                    const resources = node.relations?.activity?.activity_resources || [];
                    resources.forEach(resource => {
                        result.push({
                            name: node.node_name || '未命名课程',
                            resource_id: resource.resource_id || '',
                            studyTime: resource.study_time
                        });
                    });
                }
            };
            // 遍历初始节点数组
            fullDatas.nodes.forEach(node => traverse(node));
            return result.filter(item => item.resource_id); // 过滤无效项
        }
        function getDynamicToken() {
            try {
                const pattern = /^ND_UC_AUTH-([0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12})&ncet-xedu&token$/;
                for (let key of Object.keys(localStorage)) {
                    if (pattern.test(key)) {
                        return {
                            key: key,
                            appId: key.match(pattern)[1],
                            token: JSON.parse(JSON.parse(localStorage.getItem(key)).value)
                        };
                    }
                }
                throw Error("Invalid token! can not get loginInfo!");
            } catch (err) {
                throw Error("At:getDynamicToken>>" + err);
            }
        }
        // const tokenData = getDynamicToken(); if (tokenData) { console.log("完整键名:", tokenData.key);
        //     console.log("用户UUID:", tokenData.uuid); console.log("Token值:", tokenData.token); }
        // 作者：zzzzzzys
        // https://greasyfork.org/zh-CN/users/1176747-zzzzzzys
        // 搬运可耻
        const getMACAuthorizationHeaders = function (url, method) {
            let n = getDynamicToken().token
            return He(url, method, {
                accessToken: n.access_token, macKey: n.mac_key, diff: n.diff
            });
        }
        function Ze(e) {
            for (var t = "0123456789ABCDEFGHIJKLMNOPQRTUVWXZYS".split(""), n = "", r = 0; r < e; r++) n += t[Math.ceil(35 * Math.random())];
            return n
        }
        function Fe(e) {
            return (new Date).getTime() + parseInt(e, 10) + ":" + Ze(8)
        }
        function ze(e, t, n, r) {
            let o = {
                relative: new URL(e).pathname, authority: new URL(e).hostname
            }
            let i = t + "\n" + n.toUpperCase() + "\n" + o.relative + "\n" + o.authority + "\n";
            return CryptoJS.HmacSHA256(i, r).toString(CryptoJS.enc.Base64)
        }
        function He(e) {
            // 作者：zzzzzzys
            // https://greasyfork.org/zh-CN/users/1176747-zzzzzzys
            // 搬运可耻
            let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "GET",
                n = arguments.length > 2 ? arguments[2] : void 0, r = n.accessToken, o = n.macKey, i = n.diff,
                s = Fe(i), a = ze(e, s, t, o);
            return 'MAC id="'.concat(r, '",nonce="').concat(s, '",mac="').concat(a, '"')
        }
        const setProgress = function (url, duration) {
            const info = getDynamicToken()
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    'url': url, method: 'PUT', "headers": {"accept": "application/json, text/plain, */*", "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6", "authorization": getMACAuthorizationHeaders(url, 'PUT'), "cache-control": "no-cache", "pragma": "no-cache", "content-type": "application/json", "sdp-app-id": info.appId, "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Microsoft Edge\";v=\"132\"", "sec-ch-ua-mobile": "?0", "sec-ch-ua-platform": "\"Windows\"", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "cross-site", "host": "x-study-record-api.ykt.eduyun.cn", "origin": "https://basic.smartedu.cn", "referer": "https://basic.smartedu.cn/", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0"}, data: JSON.stringify({position: duration - 3}), // fetch:true,
                    onload: function (res) {
                        console.log('请求成功')
                        console.log(res)
                        if (res.status === 200) {
                            console.log("刷课成功！")
                            resolve(res)
                        } else {
                            reject('服务器拒绝：' + res.response)
                        }
                    }, onerror: function (err) {
                        reject('请求错误！' + err.toString())
                    }})})}
        function main() {
            init()
            if (!localStorage.getItem("noMoreDialog")) {
                showGuideDialog()
            }
            let myStyle = document.createElement('style')
            myStyle.innerHTML = style;
            document.head.appendChild(myStyle);
            /*let intercept=GM_GetValue*/
            let div = document.createElement('div');
            div.innerHTML = `<div style="left: 10px;top: 280px;" id="my1" class="button-3" >即刻开刷(中小学)</div> <div style="position: fixed; left: 10px;top: 320px;;background: #ed5822;color: white; padding: 10px 20px; border-radius: 25px; cursor: pointer; box-shadow: 0 3px 15px rgba(0,0,0,0.2); z-index: 999999999999; transition: transform 0.3s;" id="my3"    >职业教育/高等教育 刷课</div> <div style="left: 10px;top: 370px;" id="my2"   class="button-3" >2222</div>`
            document.body.appendChild(div);
            const trigger = document.getElementById('my3')
            trigger.addEventListener('click', () => {
                if (location.href.includes("core.teacher.vocational.smartedu.cn")) {
                    createControlPanel()
                } else {
                    Swal.fire({
                        title: "注意",
                        text: "请在职业/高等教育的视频播放页面使用，中小学请用上面的按钮！",
                        icon: 'info', // showCancelButton: true,
                        confirmButtonColor: "#FF4DAFFF", // cancelButtonText: "取消，等会刷新",
                        confirmButtonText: "了解~",
                    })}});
            trigger.addEventListener('mouseenter', () => trigger.style.transform = 'scale(1.05)');
            trigger.addEventListener('mouseleave', () => trigger.style.transform = 'none');
            let isProcessing = false;
            const button = document.getElementById('my1');
            button.addEventListener("click", async () => {
                if (isProcessing) {
                    Swal.fire({title: "操作进行中", text: "正在刷课中，请勿重复点击！", icon: "warning", confirmButtonColor: "#FF4DAFFF", confirmButtonText: "知道了"});
                    return;
                }
                try {
                    isProcessing = true; // 标记开始处理
                    button.disabled = true; // 禁用按钮
                    button.textContent = "刷课进行中..."; // 修改按钮文字
                    let resId
                    const allResults = [];
                    if (!resId) {
                        console.log("二次获取resId...")
                        resId = getResourceIdFromFullData()
                    }
                    if (resId && typeof resId === 'string') {
                        await setProgress(requestObj.resourceLearningPositions.url + resId + '/' + getDynamicToken().token["user_id"], getVideoTime())
                        allResults.push({name: '单个课程', status: 'success'});
                    } else if (Array.isArray(resId) && resId.length > 0) {
                        const results = await Promise.allSettled(resId.map(async (item) => {
                            try {
                                await setProgress(requestObj.resourceLearningPositions.url + item.resource_id + '/' + getDynamicToken().token["user_id"], item.studyTime)
                                return {name: item.name, status: 'success'};
                            } catch (e) {
                                console.error(`${item.name} 失败！`, e);
                                return {name: item.name, status: 'fail', error: e};
                            }
                        }));
                        console.log(results)
                        results.forEach(r => {
                            if (r.status === 'fulfilled') allResults.push(r.value); else allResults.push(r.reason); // 捕获未处理的意外错误
                        });
                    }
                    if (Swal) {
                        Swal.fire({
                            title: "刷课成功！", html: ` <div style="text-align: left; max-height: 20vh; overflow-y: auto;"> <p>总计：${allResults.filter(r => r.status === 'success').length} 成功 / ${allResults.filter(r => r.status === 'fail').length} 失败</p> <hr> <ul style="padding-left: 20px; list-style-type: none;"> ${allResults.map(result => ` <li> ${result.status === 'success' ? '✅' : '❌'} <strong>${result.name}</strong> ${result.error ? `<br><code style="color:red">${result.error.message || result.error}</code>` : ''} </li> `).join('')} </ul> </div> <div style="text-align: left;"> <p>视频只剩下最后5s，需要看完，请刷新后再观看！</p> <p>刷课前请勿播放视频，否则可能会导致进度更新失败！</p> <hr style="margin: 10px 0;"> ${renderQQGroups()} </div> `, icon: 'success', confirmButtonColor: "#FF4DAFFF", // cancelButtonText: "取消，等会刷新",
                            // 作者：zzzzzzys
                            // https://greasyfork.org/zh-CN/users/1176747-zzzzzzys
                            // 搬运可耻
                            confirmButtonText: "确定",
                        })
                    }
                } catch (e) {
                    console.error(e)
                    if (Swal) {
                        Swal.fire({
                            title: "失败！",
                            text: e.toString() + "    请在视频播放页面使用！",
                            icon: 'error', // showCancelButton: true,
                            confirmButtonColor: "#FF4DAFFF", // cancelButtonText: "取消，等会刷新",
                            confirmButtonText: "点击去反馈",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.open("https://greasyfork.org/zh-CN/scripts/525037/feedback")
                            }
                        });
                    }
                } finally {
                    isProcessing = false; // 重置处理状态
                    button.disabled = false; // 恢复按钮
                    button.textContent = "即刻开刷(中小学)"; // 恢复按钮文字
                }})
            document.getElementById('my2').addEventListener('click', function () {
                Swal.fire({title: '<span style="font-size:24px; color: #FF4DAF;">欢迎加入交流群</span>', html: ` <div style="text-align: left; max-width: 580px; line-height: 1.7; font-size: 14px;"> <!-- 社群入口 --> ${renderQQGroups()} <!-- 核心价值 --> <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;"> <!-- 左列 --> <div style="padding-right:15px; border-right:1px dashed #eee;"> <div style="color: #27ae60; margin-bottom:15px;"> <h4 style="margin:0 0 8px 0; font-size:15px;">📚 减负工具</h4> <!--                        <ul style="margin:0; padding-left:18px;">--> <!--                            <li>自动化备课工具套件</li>--> <!--                            <li>智能学情分析报告</li>--> <!--                            <li>教学资源智能检索</li>--> <!--                        </ul>--> </div> <div style="color: #2980b9; margin-top:15px;"> <h4 style="margin:0 0 8px 0; font-size:15px;">🛡️ 使用规范</h4> <ul style="margin:0; padding-left:18px;"> <li>仅限个人使用</li> <li>禁止商业倒卖行为</li> <li>禁止利用此脚本收费代刷</li> <li>请勿批量自动化操作大量刷课（如需要请联系我，更加高效安全）</li> </ul> </div> </div> <!-- 右列 --> <div style="padding-left:15px;"> <div style="color: #e67e22;"> <h4 style="margin:0 0 8px 0; font-size:15px;">⚖️ 版权声明</h4> <ul style="margin:0; padding-left:18px;"> <li>本工具完全免费</li> <li>源码禁止二次传播</li> <!--                            <li>保留原创法律权利</li>--> </ul> </div> <div style="color: #9b59b6; margin-top:15px;"> <h4 style="margin:0 0 8px 0; font-size:15px;">💌 联系我们</h4> <ul style="margin:0; padding-left:18px;"> <!--                            <li>反馈建议：edu@service.com</li>--> <li>紧急问题：请私聊群管理员</li> </ul> </div> </div> </div> </div> `,
                    icon: 'info',
                    confirmButtonColor: "#FF4DAF",
                    confirmButtonText: "2222",
                    showCloseButton: true,
                    width: 680,
                    showDenyButton: true,
                    denyButtonText: '<img src="https://img.icons8.com/fluency/24/star--v1.png" style="height:18px; vertical-align:middle;"> 前往好评', // 带图标的按钮
                    denyButtonColor: '#FFC107',
                    focusDeny: false,
                    showCancelButton: false,
                    // 新增按钮回调
                    preDeny: () => {
                        window.open("https://greasyfork.org/zh-CN/scripts/525037/feedback", "_blank");
                        return false; // 阻止弹窗关闭
                    },
                    customClass: {
                        denyButton: 'swal-custom-deny', popup: 'swal-custom-popup', title: 'swal-custom-title'
                    },
                    footer: '<div style="color:#95a5a6; font-size:12px;">请合理使用。</div>'
                });});}
        main()
        console.log('智慧教育平台 模块启动!');
    }
}
//师学通
class TeacherModule {
    constructor() {
    }
    run(config) {
        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}){
        class AutoStudyIndex {
            constructor(options = {}) {
                // 配置参数合并
                this.config = {
                    catalogSelector: '.catalog-list',
                    catalog_cn: ".firstmenu",
                    courseMaxTime: 150 * 60 * 1000,
                    ...options
                };
                // 任务状态控制
                this.isRunning = false;
                this.currentWindow = null;
                this.channel = new BroadcastChannel('my-channel');
                this.statusPanel=new AutomationStatusPanel()
                // this.init()
            }
            init(){
                /*let intercept=GM_GetValue*/
                let div = document.createElement('div');
                div.innerHTML = `<div  id="my1" class="button-3" >即刻开刷</div>`
                document.body.appendChild(div);
                let isClick = false;
                let my1 = document.getElementById('my1')
                my1.addEventListener("click", async () => {
                    try {
                        if(!this.isRunning){
                            this.statusPanel.startMonitoring();
                            this.statusPanel.updateMetrics({
                                currentTask: '自动化任务已开始',
                            });
                            // this.isRunning = true
                            my1.innerText = "自动刷课中..."
                            my1.disabled=true
                            await this.start()
                            this.isRunning  = false;
                        }
                    }catch (e) {
                        if (typeof Swal !== 'undefined') {
                            Swal.fire({
                                title: "错误！",
                                text: e.toString(),
                                icon: 'error',
                                confirmButtonColor: "#FF4DAFFF",
                                confirmButtonText: "关闭"
                            })}}finally {
                        if(!this.isRunning){
                            my1.innerText  = "点击开刷";
                            my1.disabled  = false;
                        }}})}
            // 主入口方法
            async start() {
                if (this.isRunning) {
                    console.warn('任务已在运行中');
                    return;
                }
                this.isRunning = true;
                await this.runTask();
            }
            // 停止任务
            stop() {
                this.isRunning = false;
                this.channel.close(); // 关闭通信频道
                if (this.currentWindow) {
                    this.currentWindow.close();
                }
            }
            // 核心任务循环
            async runTask() {
                if (!this.isRunning) return;
                try {
                    await this.autoStudy();
                    this.showCompletion()
                    console.log('本轮任务执行完成');
                    this.statusPanel.updateMetrics({
                        currentTask:"任务已完成"
                    })
                    this.statusPanel.stopMonitoring()
                } catch (error) {
                    console.error('任务执行出错:', error);
                }
                // 设置下一轮执行
                if (this.isRunning) {
                    // setTimeout(() => this.runTask(), this.config.interval);
                }
            }
            // 遍历目录执行学习
            async autoStudy() {
                let catalogList = document.querySelectorAll(this.config.catalogSelector);
                if(catalogList.length===0){
                    catalogList=document.querySelectorAll(this.config.catalog_cn);
                }
                if (catalogList.length === 0) {
                    console.warn('未找到课程目录');
                    return;
                }
                for (const element of catalogList) {
                    if (!this.isRunning) break;
                    const title = element.querySelector('a').innerText;
                    console.log(`\n============== ${title} ==============`);
                    this.statusPanel.updateMetrics({
                        currentTask:title
                    })
                    await this.sleep(2); // 章节间间隔
                    const status = this.checkStatus(element);
                    if (status === 0) {
                        console.log('当前章节已完成');
                        continue;
                    }
                    await this.processChapter(element);
                    if(!(await this.statusPanel.validateAuthCode())){
                        break
                    }}}
            // 处理单个章节
            async processChapter(element) {
                const url = this.getChapterUrl(element);
                if (!url) {
                    console.error('获取章节链接失败');
                    return;
                }
                let retryCount = 0;
                let result = await this.openAndWaitForTask(url);
                // 处理需要重试的情况
                while (result === 1 && retryCount < 3) {
                    retryCount++;
                    console.log(`第 ${retryCount} 次重试...`);
                    result = await this.openAndWaitForTask(url);
                }
                // 处理最终结果
                switch (result) {
                    case 0:
                        console.log('章节学习完成');
                        break;
                    case 2:
                        console.warn('任务超时');
                        try {
                            this.currentWindow && this.currentWindow.close()
                        }catch (e) {
                            console.warn(e);
                        }
                        break;
                    default:
                        console.warn('任务异常终止');
                        try {
                            this.currentWindow && this.currentWindow.close()
                        }catch (e) {
                            console.warn(e);
                        }}}
            // 打开新窗口并监听任务
            async openAndWaitForTask(url) {
                return new Promise(async (resolve) => {
                    const newWindow = window.open(url);
                    if (!newWindow) {
                        console.error('弹窗被阻止，请允许弹窗');
                        return resolve(2);
                    }
                    this.currentWindow = newWindow;

                    const courseMaxTime = this.statusPanel.getMaxTime() || this.config.courseMaxTime
                    // 设置超时处理
                    const timeoutId = setTimeout(() => {
                        this.channel.postMessage('timeout');
                        try {
                            this.currentWindow.close()
                        }catch (e) {
                            console.error(e);
                        }
                        resolve(2);
                    }, courseMaxTime);
                    // 监听消息
                    this.channel.onmessage = (event) => {
                        clearTimeout(timeoutId);
                        resolve(event.data === 'finish' ? 0 : 1);
                    };
                });
            }
            // 工具方法
            checkStatus(element) {
                let statusIcon
                if(location.href.includes('cn202511002')){
                    statusIcon = element.querySelectorAll('i')[1];
                }else {
                    statusIcon = element.querySelectorAll('i')[2];
                }
                return statusIcon.innerText === "已完成" ? 0 : 1;
            }
            getChapterUrl(element) {
                return element.querySelector('a')?.href;
            }
            sleep(seconds) {
                return new Promise(resolve =>
                    setTimeout(resolve, seconds * 1000));
            }
            // 完成提示（需页面已引入 SweetAlert）
            showCompletion() {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: "学习完成！",
                        text: "本版块所有课程已达到学习要求",
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "关闭"
                    }).then(() => {
                        try { window.close(); }
                        catch { /* 忽略关闭错误 */ }
                    });}}}
        GM_addStyle(`.automation-panel { position: fixed; bottom: 0; left: 0; width: 400px; height:450px; background: rgba(255,255,255,0.95); border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 2000; border: 1px solid #eee; font-family: system-ui, -apple-system, sans-serif; transition: transform 0.3s ease; } .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #f0f0f0; cursor: move; } .close-btn { background: none; border: none; font-size: 1.5em; color: #666; cursor: pointer; transition: color 0.2s; } .close-btn:hover { color: #ff4444; } .metrics-container { padding: 16px; } .metric-item { margin-bottom: 12px; display: flex; justify-content: space-between; } .metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px; } .metric-box { padding: 12px; border-radius: 8px; text-align: center; background: #f8f9fa; } .metric-box .title { font-size: 0.9em; color: #666; margin-bottom: 6px; } .metric-box .count { font-weight: 600; font-size: 1.2em; } .metric-box input { font-weight: 600; font-size: 1.2em; width: 40%; } .success { background: #e8f5e9; color: #2e7d32; } .error { background: #ffebee; color: #c62828; } .speed { background: #fff3e0; color: #ef6c00; } .config-item { background: #f0f4ff !important; padding: 15px !important; } .config-input { width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; margin-top: 8px; transition: all 0.3s ease; } .config-input:focus { border-color: #4a90e2; box-shadow: 0 0 5px rgba(74,144,226,0.3); outline: none; } /* 验证码输入组 */ .config-group { display: flex; gap: 8px; margin-top: 10px; } .code-input { flex: 1; letter-spacing: 2px; } .verify-btn { background: #4a90e2; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; transition: background 0.3s; } .verify-btn:hover { background: #357abd; } /* 输入验证提示 */ input:invalid { border-color: #ff4444; animation: shake 0.5s; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(5px); } 75% { transform: translateX(-5px); } } .purchase-item { margin: 8px 0; } .purchase-link { color: #FF4DAF; text-decoration: underline; transition: color 0.2s; } .purchase-link:hover { color: #ff1f9f; } .price-tag { font-size: 0.9em; } `)
        GM_addStyle(`.button-3 { position: fixed; appearance: none; background-color: #e52b13; border: 1px solid rgba(27, 31, 35, .15); border-radius: 6px; box-shadow: rgba(27, 31, 35, .1) 0 1px 0; box-sizing: border-box; color: #ffffff; cursor: pointer; display: inline-block; font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"; font-size: 14px; font-weight: 600; line-height: 20px; padding: 6px 16px; left: 0px; bottom: 470px; text-align: center; text-decoration: none; user-select: none; -webkit-user-select: none; touch-action: manipulation; vertical-align: middle; white-space: nowrap; } .button-3:focus:not(:focus-visible):not(.focus-visible) { box-shadow: none; outline: none; } .button-3:hover { background-color: #2c974b; } .button-3:focus { box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px; outline: none; } .button-3:disabled { background-color: #94d3a2; border-color: rgba(27, 31, 35, .1); color: rgba(255, 255, 255, .8); cursor: default; } .button-3:active { background-color: #298e46; box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset; }`)
        class AutomationStatusPanel {
            constructor() {
                this.panelId = 'auto-status-panel';
                this.link=""
                this.config  = {
                    maxWaitTime: 150,
                    authCode: '',
                    isVerified: false
                };
                this.state = {
                    isVisible: false,
                    lastUpdate: Date.now(),
                    metrics: {
                        runTime: 0,
                        currentTask: '',
                        successCount: 0,
                        errorCount: 0,
                        speed: 0
                    },
                    timer:null
                };
                this.initPanel();
                this.toggleVisibility(true);
            }
            // 初始化状态面板
            initPanel() {
                if (!document.getElementById(this.panelId))  {
                    const template = ` <div id="${this.panelId}"  class="automation-panel"> <div class="panel-header"> <h2>🤖 自动化运行脚本</h2> <label>v${GM_info.script.version}</label> <!--                        <button class="close-btn">&times;</button>--> </div> <div class="metrics-container"> <div class="metric-item"> <span class="label">🕒 运行时长：</span> <span class="value" id="run-time">0m 0s</span> </div> <div class="metric-item"> <span class="label">📌 当前任务：</span> <span class="value" id="current-task">空闲</span> </div> <div class="metric-grid"> <!--                            <div class="metric-box success">--> <!--                                <div class="title">✅ 成功</div>--> <!--                                <div class="count" id="success-count">0</div>--> <!--                            </div>--> <!--                            <div class="metric-box error">--> <!--                                <div class="title">❌ 失败</div>--> <!--                                <div class="count" id="error-count">0</div>--> <!--                            </div>--> <!--                            <div class="metric-box speed">--> <!--                                <div class="title">⚡ 速度</div>--> <!--                                <div class="count" id="speed">常速</div>--> <!--                            </div>--> </div> <div class="metric-box config-item"> <div class="title">⏳ 单个课程最大等待时间（分钟）(授权码使用时有效)</div> <input type="number" id="max-wait-time" class="config-input" min="1" max="300" step="1" value="150" data-preset="advanced"> </div> <div class="metric-box config-item"> <div class="title">🔑 验证码功能</div> <div class="config-group"> <input type="text" id="auth-code" class="config-input code-input" placeholder="输入授权码" maxlength="16" data-preset="advanced"> <button class="verify-btn">✅ 验证</button> </div> </div> <div> <li>前往购买链接：</li> ${this.linkHtml()} </div> </div> </div> `;
                    document.body.insertAdjacentHTML('beforeend',  template);
                    this.bindEvents();
                    // 绑定配置输入事件
                    document.getElementById('max-wait-time').addEventListener('change',  (e) => {
                        this.config.maxWaitTime  = Math.min(300,  Math.max(1,  e.target.valueAsNumber));
                        this.saveConfig();
                    });
                    document.getElementById('auth-code').addEventListener('input',  (e) => {
                        if(e.target.value.length === 16){
                            this.config.authCode  = e.target.value;
                            this.saveConfig();
                        }
                    });
                    document.querySelector('.verify-btn').addEventListener('click',  () => {
                        this.validateAuthCode().then(r =>{} );
                    });
                    this.loadConfig();  // 加载保存的配置
                    // this.loadStyles();
                }}
            linkHtml(){
                const link=[
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                let list=''
                for(let i=0;i<link.length;i++){
                    list+=` <li class="purchase-item"> 前往<a href="${link[i]}" target="_blank" class="purchase-link" data-track="purchase_click"> 授权码获取页面${i+1} </a> <span class="price-tag">（不定时放出免费/优惠授权码）</span> </li> `
                }
                return list
            }
            // 绑定交互事件
            bindEvents() {
                const panel = document.getElementById(this.panelId);
                // panel.querySelector('.close-btn').addEventListener('click',  () => {
                //    this.toggleVisibility(false);
                // });
                // 实现拖拽功能
                let isDragging = false;
                let offset = [0,0];
                panel.querySelector('.panel-header').addEventListener('mousedown',  (e) => {
                    isDragging = true;
                    offset = [
                        panel.offsetLeft  - e.clientX,
                        panel.offsetTop  - e.clientY
                    ];
                });
                document.addEventListener('mousemove',  (e) => {
                    if (isDragging) {
                        panel.style.left  = `${e.clientX  + offset[0]}px`;
                        panel.style.top  = `${e.clientY  + offset[1]}px`;
                    }
                });
                document.addEventListener('mouseup',  () => {
                    isDragging = false;
                });
            }
            // 更新状态数据
            updateMetrics(data) {
                if(data?.successCount==="add"){
                    delete data.successCount
                    this.state.metrics.successCount++
                }
                if(data?.errorCount==="add"){
                    delete data.errorCount
                    this.state.metrics.errorCount++
                }
                Object.assign(this.state.metrics,  data);
                this.state.lastUpdate  = Date.now();

                // 实时更新DOM
                document.getElementById('run-time').textContent  =
                    `${Math.floor(this.state.metrics.runTime/60)}m  ${this.state.metrics.runTime%60}s`;
                document.getElementById('current-task').textContent  =
                    this.state.metrics.currentTask  || '空闲';
                // document.getElementById('success-count').textContent  =
                //     this.state.metrics.successCount;
                // document.getElementById('error-count').textContent  =
                //     this.state.metrics.errorCount;
                // document.getElementById('speed').textContent  =
                //     `${this.state.metrics.speed}/min`;
            }
            // 控制显示/隐藏
            toggleVisibility(show = true) {
                const panel = document.getElementById(this.panelId);
                if (panel) {
                    panel.style.display  = show ? 'block' : 'none';
                    this.state.isVisible  = show;
                }}
            // 自动更新计时器
            startAutoUpdate() {
                if(!this.state.timer){
                    this.state.timer=setInterval(() => {
                        this.state.metrics.runTime  = Math.floor(
                            (Date.now()  - this.state.startTime)  / 1000
                        );
                        this.updateMetrics({});  // 触发界面更新
                    }, 1000);
                }}
            // 完整生命周期管理
            startMonitoring() {
                this.initPanel();
                this.toggleVisibility(true);
                this.state.startTime  = Date.now();
                this.startAutoUpdate();
            }
            stopMonitoring() {
                clearInterval(this.state.timer)
                // this.toggleVisibility(false);
                // const panel = document.getElementById(this.panelId);
                // panel?.remove();
            }
            // 验证码校验方法
            async validateAuthCode() {
                try {
                    const isValid = await this.checkAuthCode(this.config.authCode);
                    console.log("验证结果：",isValid)
                    if (isValid) {
                        this.config.isVerified  = true;
                        this.saveConfig();
                        try {
                            Swal.fire({
                                title: "验证成功！",
                                text: "高级功能已启用!已完全自动化！",
                                icon: 'success',
                                confirmButtonColor: "#FF4DAFFF",
                                confirmButtonText: "关闭",
                                timer: 2000,
                            })
                            // layer.msg('✅  验证成功，高级功能已启用', {time: 2000});
                        }catch (e) {

                        }
                        return true
                    } else {
                        try {
                            Swal.fire({
                                title: '<span style="color:#FF4DAF">验证失败！</span>', // HTML标题
                                html: `<div style="text-align:left"> <p style="margin:10px 0">未开启高级功能！请执行以下操作：</p> <ol style="padding-left:20px"> <li>手动点击下一课程,继续使用基础功能</li> <li>前往购买链接：</li> ${this.linkHtml()} </ol> </div>`,
                                icon: 'error',
                                showConfirmButton: true,
                                confirmButtonText: '我知道了',
                                confirmButtonColor: '#FF4DAF',
                                showCloseButton: true, // 显示关闭按钮
                                allowOutsideClick: false, // 禁止点击外部关闭
                                allowEscapeKey: false,   // 禁止ESC关闭
                                timer: 0,               // 禁止自动关闭
                                customClass: {
                                    popup: 'custom-swal-popup',
                                    title: 'custom-swal-title',
                                    content: 'custom-swal-content'
                                }
                            });
                            // layer.msg('❌  验证码无效', {time: 2000, icon: 2});
                        }catch (e) {}
                    }
                } catch (error) {
                    console.error(' 验证服务异常:', error.toString());
                    Swal.fire({
                        title: "验证失败！",
                        text: error.toString(),
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "关闭"
                    })
                }
                return false
            }
            // 配置持久化
            saveConfig() {
                const data=JSON.stringify({
                    maxWaitTime: parseInt(document.getElementById('max-wait-time').value),
                    lastAuthCode: document.getElementById('auth-code').value})
                GM_setValue('autoConfig', data );
                console.log("设置存储：",data)
            }
            getMaxTime(){
                return parseInt(document.getElementById('max-wait-time').value)*60*1000
            }
            loadConfig() {
                const saved = GM_getValue('autoConfig');
                console.log("加载存储：",saved)
                if (saved) {
                    const { maxWaitTime, lastAuthCode } = JSON.parse(saved);
                    document.getElementById('max-wait-time').value  = maxWaitTime;
                    document.getElementById('auth-code').value  = lastAuthCode;
                    this.config.maxWaitTime  = maxWaitTime;
                    this.config.authCode  = lastAuthCode;
                }}
            async checkAuthCode(code) {
                const AUTH_CODE_REGEX = /^[A-Z0-9]{16}$/;
                if(code===""){
                    return false
                }
                if(!AUTH_CODE_REGEX.test(code)){
                    throw Error("格式错误，应为16位大写字母或数字！")
                }
                // 制作不易，未从服务器加载关键函数
                // 还请多多支持，勿修改判断代码
                const res=await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCode?authCode="+code,
                        method: 'GET',
                        onload: function (res) {
                            console.log('请求成功')
                            console.log(res)
                            if (res.status === 200) {
                                const result=JSON.parse(res.response)
                                if(result.code===200){
                                    resolve(result)
                                }else {
                                    reject(result.msg)
                                }
                            }else {
                                reject('服务器拒绝：'+res.response)
                            }
                        },
                        onerror: function (err) {
                            console.error(err)
                            reject('请求错误！' + err.toString())
                        }})})
                return res.code === 200;
            }}
        class AutoStudyDetailNew{
            constructor(config = {}) {
                // 初始化配置合并
                this.config  = {
                    onlyTime:true,
                    requestTemplates: {
                        insertStudyRecord: {
                            url: "https://pn202413060.stu.teacher.com.cn/studyRecord/insertStudyRecord",
                            method: "POST"
                        },
                        findStudyTime: {
                            url: "https://pn202413060.stu.teacher.com.cn/course/findCourseStudyTime",
                            method: "POST"
                        }
                    },
                    selectors: {
                        catalog: ".course-type-item ul li",
                        video: ".ccH5playerBox video"
                    },
                    ...config
                };
                // 状态管理
                this.state  = {
                    studyTimer: unsafeWindow.StudyTimeClockEle,
                    courseStudyTime: unsafeWindow.courseStudyTime,
                    worker: null,
                    originalMethods: {
                        consoleClear: unsafeWindow.console.clear,
                        startTimeClock: unsafeWindow.startTimeClock
                    }
                };
                this.statusPanel=new AutomationStatusPanel()
                this.statusPanel.startMonitoring()
                // 自动绑定方法
                this.handleXHR  = this.handleXHR.bind(this);
                this.onVisibilityChange  = this.onVisibilityChange.bind(this);
            }
            // 主初始化入口
            async init() {
                layer.msg('自动化脚本加载成功！', { icon: 1, zIndex: 19891033 }, function () {})
                setTimeout(()=>{
                    layer.tips(' 自动化脚本 运行中...', '#projectIitle a', {
                        tips: 2,
                        time: 0,
                        closeBtn: true,
                    });
                },2000)
                this.setupXHRInterceptor();
                // this.patchGlobalMethods();
                this.setupEventListeners();
                this.clearPauseHandler();
                // this.startBackgroundWorker();
                unsafeWindow.startTimeClock = this.reloadStartTimeClock
                if (!(await this.statusPanel.validateAuthCode())) {
                    Swal.fire({
                        title: '<span style="color:#FF4DAF">验证失败！</span>', // HTML标题
                        html: `<div style="text-align:left"> <p style="margin:10px 0">未开启高级功能！脚本不会自动填写验证码窗口！</p> <ol style="padding-left:20px"> <li>继续使用基础功能：</li> <li>自动播放</li> <li>自动下一个(自动点击阻止弹窗)</li> <li>前往购买链接：</li> ${this.statusPanel.linkHtml()} </ol> </div>`,
                        icon: 'error',
                        showConfirmButton: true,
                        confirmButtonText: '我知道了',
                        confirmButtonColor: '#FF4DAF',
                        showCloseButton: true, // 显示关闭按钮
                        allowOutsideClick: false, // 禁止点击外部关闭
                        allowEscapeKey: false,   // 禁止ESC关闭
                        timer: 0,               // 禁止自动关闭
                        customClass: {
                            popup: 'custom-swal-popup',
                            title: 'custom-swal-title',
                            content: 'custom-swal-content'
                        }
                    });
                    this.handleValidateCodeDialog()
                }else {
                    unsafeWindow.getStudyTime = this.reloadGetStudyTime
                }
                await this.autoStudy();
            }
            handleValidateCodeDialog (timeout=5000) {
                let intervalId = null; // 定时器 ID
                const checkInterHandle = async () => {
                    const dialogSelector = ".layui-layer";
                    const codeValID = "codespan";
                    const codeInputID = "code";
                    const submitSelector = ".layui-layer-btn0";
                    try {
                        // 获取验证码显示元素和输入框
                        const val = document.getElementById(codeValID);
                        const input = document.getElementById(codeInputID);
                        const subBtn = document.querySelector(submitSelector);

                        // 如果验证码弹窗存在
                        if (val && input && subBtn) {
                            console.log("检测到验证码弹窗!");
                            if (intervalId) {
                                clearInterval(intervalId);
                                // intervalId = setInterval(checkInterHandle, timeout);
                            }
                            if (!(await this.statusPanel.validateAuthCode())) {
                                Swal.fire({
                                    title: '<span style="color:#FF4DAF">检测到验证码弹窗！</span>', // HTML标题
                                    html: `<div style="text-align:left"> <p style="margin:10px 0">未开启高级功能！脚本不会自动填写验证码窗口！</p> <ol style="padding-left:20px"> <li>前往购买链接：</li> ${this.statusPanel.linkHtml()} </ol> </div>`,
                                    icon: 'info',
                                    showConfirmButton: true,
                                    confirmButtonText: '我知道了',
                                    confirmButtonColor: '#FF4DAF',
                                    showCloseButton: true, // 显示关闭按钮
                                    allowOutsideClick: false, // 禁止点击外部关闭
                                    allowEscapeKey: false,   // 禁止ESC关闭
                                    timer: 0,               // 禁止自动关闭
                                    customClass: {popup: 'custom-swal-popup', title: 'custom-swal-title', content: 'custom-swal-content'}
                                }).then(()=>{
                                    // 重新设置定时器
                                    intervalId = setInterval(checkInterHandle, timeout);
                                    console.log("重新设置定时器！")
                                })}}
                    } catch (e) {
                        console.error("异步检测挂机验证错误：" + e);
                        // 发生错误时重新设置定时器
                        if (!intervalId) {
                            intervalId = setInterval(checkInterHandle, timeout);
                        }}};
                // 初始化定时器
                intervalId = setInterval(checkInterHandle, timeout);
            };
            // XHR 拦截系统
            setupXHRInterceptor() {
                /** @type {function[]} */
                const callbacks = [];
                const originalSend = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.send  = function() {
                    callbacks.forEach(cb  => cb(this));
                    originalSend.apply(this,  arguments);
                };
                this.addXHRCallback(this.handleXHR);
            }
            /**
             * 添加XHR回调
             * @param {function(XMLHttpRequest): void} callback
             */
            addXHRCallback(callback) {
                XMLHttpRequest.callbacks  = XMLHttpRequest.callbacks  || [];
                XMLHttpRequest.callbacks.push(callback);
            }
            /**
             * XHR响应处理
             * @param {XMLHttpRequest} xhr
             */
            handleXHR(xhr) {
                xhr.addEventListener("load",  () => {
                    if (xhr.readyState  === 4 && xhr.status  === 200) {
                        const { findStudyTime, insertStudyRecord } = this.config.requestTemplates;
                        if (xhr.responseURL.includes(findStudyTime.url))  {
                            console.log("捕获请求数据：", JSON.parse(xhr.response));
                        } else if (xhr.responseURL.includes(insertStudyRecord.url))  {
                            // this.handleRecordInsertResponse(JSON.parse(xhr.response));
                        }}});}
            // 定时器控制系统
            reloadStartTimeClock() {
                if (unsafeWindow.StudyTimeClockEle)  {
                    clearInterval(unsafeWindow.StudyTimeClockEle);
                    unsafeWindow.courseStudyTime++;
                }
                unsafeWindow.StudyTimeClockEle  = setInterval(() => {
                    unsafeWindow.courseStudyTime++;
                    window.sessionStorage.setItem("courseStudyTime", unsafeWindow.courseStudyTime);
                }, 1000);
            }
            // 事件监听管理
            setupEventListeners() {
                document.addEventListener('visibilitychange',  this.onVisibilityChange);
            }
            clearPauseHandler () {
                unsafeWindow.on_CCH5player_pause = function () {
                    console.log("视频暂停了，计时继续...")
                    unsafeWindow.startTimeClock()
                }
                console.log(window.on_CCH5player_pause)
                /*video.addEventListener('pause', function (event) { console.log('视频暂停事件触发'); // 阻止其他监听器的执行 event.stopImmediatePropagation(); },true);*/
            }
            onVisibilityChange() {
                if (document.visibilityState  === 'hidden') {
                    this.reloadStartTimeClock();
                }
            }
            reloadGetStudyTime(period) {
                $.ajax({
                    url: '../course/findCourseStudyTime',
                    type: "post",
                    data: {
                        "courseCode": courseCode,
                        "userId": userId,
                        "studyPlanId": studyPlanId,
                        "period": period
                    },
                    success: function(result) {
                        if(result.isSuccess==1) {
                            if(result.data) {
                                var studyTime=result.data.studyTime>0? result.data.studyTime:0
                                var totalTime=result.data.totalTime
                                var courseStudyTimeSet=result.data.courseStudyTimeSet? result.data.courseStudyTimeSet:45
                                $("#courseStudyTimeNumber").text(parseFloat(totalTime/courseStudyTimeSet).toFixed(1))
                                $("#courseStudyBestMinutesNumber").text(totalTime)
                                if(!hebeiHideStudyTimeRule()) {
                                    $("#studyTimeRule").text("（1学时="+result.data.courseStudyTimeSet+"分钟）")
                                }
                                if(result.data.tag==1&&studyTime>=totalTime) { //设置了单科最高累计时长
                                    $("#courseStudyMinutesNumber").text(studyTime)
                                    $("#bestMinutesTips").show()
                                } else {
                                    $("#bestMinutesTips").hide()
                                    $("#courseStudyMinutesNumber").text(studyTime)
                                }
                                if(result.data.isPopover&&result.data.isPopover==1) {
                                    console.log("时间溢出，进入弹窗验证...")
                                    const code=getCourseValidateCode()
                                    $.ajax({
                                        type: "post",
                                        async: false,
                                        url: "/studyRecord/validateCourseCode",
                                        data: {"courseValidateCode": code},
                                        success: function(result) {
                                            if(result.isSuccess===1) {
                                                layer.msg('验证码校验成功，请继续学习！', { icon: 1, zIndex: 19891033 }, function () {
                                                    try {
                                                        if(player) {
                                                            player.play()
                                                        }
                                                    } catch(e) {}
                                                    startTimeClock() //继续开始学习时长计时
                                                })
                                            } else {
                                                layer.msg('验证码校验失败，请重新验证！', { icon: 2, zIndex: 19891033 })
                                            }}})}
                                if(result.data.isFacialCapture&&result.data.isFacialCapture==1) {
                                    console.log("人脸捕捉")
                                    let data ={
                                        projectId:$.cookie('projectId'),
                                        courseCode:getUrlParam('courseCode'),
                                        courseName:getUrlParam('courseName')
                                    }
                                    window.opencvMud.getOpencvImg(data);
                                }}}}})}
            validateFinish () {
                const maxID = "courseStudyBestMinutesNumber"
                const curID = "courseStudyMinutesNumber"
                const max = document.getElementById(maxID);
                const cur = document.getElementById(curID);
                if (max && cur) {
                    const maxVal = Number(max.innerText);
                    const curVal = Number(cur.innerText);
                    // console.log("最大学习时间：",maxVal)
                    // console.log("学习时间：",curVal)
                    if (maxVal !== 0 && curVal !== 0 && maxVal <= curVal) {
                        console.log("学习时间已到达最大！")
                        return true
                    }}
                return false;
            }
            sendMsg  (msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel('my-channel');
                channel.postMessage(msg);
            }
            finish() {
                this.sendMsg('finish')
                if (Swal) {
                    Swal.fire({
                        title: "刷课成功！",
                        text: `学习时间已达到最大值`,
                        icon: 'success',
                        // showCancelButton: true,
                        confirmButtonColor: "#FF4DAFFF",
                        // cancelButtonText: "取消，等会刷新",
                        confirmButtonText: "点击关闭页面，2s后自动关闭页面",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // 尝试关闭当前页面
                            try {
                                window.close(); // 关闭当前页面
                            } catch (error) {
                                console.error("无法直接关闭页面：", error);
                                // 如果无法直接关闭页面，提示用户手动关闭
                                Swal.fire({
                                    title: "无法自动关闭页面",
                                    text: "请手动关闭此页面。",
                                    icon: 'warning',
                                    confirmButtonColor: "#FF4DAFFF",
                                    confirmButtonText: "确定",
                                });}}});}
                setTimeout(() => {
                    window.close();
                }, 2000)
            }
            getCatalogType(catalogEle) {
                const type = catalogEle.getAttribute("data-type")
                if (type) {
                    if (type === "1" || type === "视频") {
                        return 1
                    } else if (type === "2" || type === "文档") {
                        return 2
                    } else if (type === "6" || type === "随堂小测") {
                        return 6
                    }
                } else {
                    throw Error("no type get error！type：" + type)
                }
                return undefined;
            }
            /**
             * 获取视频节点
             * @param {string} videoNodeSelector - 视频元素选择器
             * @param {number} timeout - timeout
             * @returns {Promise<HTMLElement>}
             */
            async getStudyVideoNode  (videoNodeSelector, timeout = 10000) {
                return new Promise(async (resolve, reject) => {
                    try {
                        // 超时处理
                        const timeoutId = setTimeout(() => {
                            console.error("获取视频节点超时");
                            clearInterval(internal); // 清除定时器
                            resolve(null); // 返回 null
                        }, timeout);
                        // 定期检查视频节点
                        const internal = setInterval(() => {
                            try {
                                const videoNode = document.querySelector(videoNodeSelector);
                                if (videoNode && videoNode.readyState >= 3) {
                                    console.log("video ready!");
                                    clearTimeout(timeoutId); // 清除超时定时器
                                    clearInterval(internal); // 清除检查定时器
                                    resolve(videoNode); // 返回视频节点
                                } else {
                                    console.log("未检查到 video，继续检查...");
                                }
                            } catch (error) {
                                console.error("检查视频节点时出错：", error);
                                clearTimeout(timeoutId); // 清除超时定时器
                                clearInterval(internal); // 清除检查定时器
                                resolve(null); // 返回 null
                            }
                        }, 1000); // 每隔 1 秒检查一次
                    } catch (error) {
                        console.error("检查视频错误：", error);
                        resolve(null); // 返回 null
                    }})};
            /**
             *
             * @param catalogSelector
             * @param timeout
             * @returns {Promise<NodeList>}
             */
            async getCatalogNode  (catalogSelector, timeout = 10000) {
                return new Promise(async (resolve, reject) => {
                    try {
                        // 超时处理
                        const timeoutId = setTimeout(() => {
                            console.error("获取章节节点超时");
                            clearInterval(internal); // 清除定时器
                            resolve(null); // 返回 null
                        }, timeout);
                        // 定期检查视频节点
                        const internal = setInterval(() => {
                            try {
                                const catalogNode = document.querySelectorAll(catalogSelector);
                                if (catalogNode && catalogNode.length > 0) {
                                    console.log("catalogNode ready!");
                                    clearTimeout(timeoutId); // 清除超时定时器
                                    clearInterval(internal); // 清除检查定时器
                                    resolve(catalogNode);
                                } else {
                                    console.log("未检查到 catalogNode，继续检查...");
                                }
                            } catch (error) {
                                console.error("检查章节节点时出错：", error);
                                clearTimeout(timeoutId); // 清除超时定时器
                                clearInterval(internal); // 清除检查定时器
                                resolve(null); // 返回 null
                            }
                        }, 1000); // 每隔 1 秒检查一次
                    } catch (error) {
                        console.error("检查章节错误：", error);
                        resolve(null); // 返回 null
                    }})};
            /**
             * 视频播放完毕的监听
             * @param video
             * @returns {Promise<unknown>}
             */
            waitForVideoEnd(video) {
                return new Promise(resolve => {
                    // 防止视频暂停
                    const checkInterval = setInterval(async () => {
                        /*if (!(new Date() <= new Date('2025/1/11'))) {
                            video.pause()
                            return
                        }*/
                        // clearPauseHandler()
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();

                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }
                            // console.log("计时器时间：", courseStudyTime)
                            if (courseStudyTime && courseStudyTime >= 400) {
                                console.log("计时器长时间：溢出,10s后刷新页面")
                                unsafeWindow.courseStudyTime = 250
                                window.sessionStorage.setItem("courseStudyTime", courseStudyTime)
                                addStudyRecord()
                                setTimeout(() => {
                                    location.reload();
                                }, 10000)
                            }
                            if (this.validateFinish()) {
                                setTimeout(() => {
                                    this.finish()
                                }, 2000)
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(()=>{
                                location.reload()
                            },2000);
                        }
                    }, 2000);
                    //每三分钟手动更新时间
                    /*const autoUpdateInterval = setInterval(async () => {
                        try {
                            console.log("定时任务：更新时间...")



                        } catch (e) {
                            console.error("autoUpdateInterval error:", e);
                            clearInterval(autoUpdateInterval);
                        }
                    },1000*60*2)*/
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        // clearInterval(autoUpdateInterval);
                        const inter = setInterval(() => {
                            try {
                                const dialogTitle = ".layui-layer-title";
                                const dialogBtn = ".layui-layer-btn0";
                                // 获取验证码显示元素和输入框
                                const title = document.querySelector(dialogTitle);
                                const btn = document.querySelector(dialogBtn);
                                // 如果验证码弹窗存在
                                if (title && title.innerText === "信息" && btn && btn.innerText.includes("我知道了")) {
                                    console.log("检测到阻止继续弹窗，自动点击...");
                                    btn.click();
                                    clearInterval(inter);
                                    console.log("视频播放完成！")
                                    resolve();
                                }
                            } catch (e) {
                                console.error("阻止继续弹窗错误：" + e)
                                clearInterval(inter);
                            }
                        }, 2000)

                    }, {once: true}); // 监听视频结束事件
                });
            }
            /**
             * 睡眠
             * @param time
             * @returns {Promise<unknown>}
             */
            sleep  (time) {
                return new Promise(resolve => setTimeout(resolve, time * 1000));
            }
            async autoStudy   () {
                let catalogList = await this.getCatalogNode(this.config.selectors.catalog);
                if (catalogList) {
                    catalogList = Array.from(catalogList);
                    for (const element of catalogList) {
                        if (this.config.onlyTime) {
                            // const finish =await refreshStudy();
                            const finish = this.validateFinish();
                            if (finish) {
                                break;
                            }

                        } else {
                            await this.sleep(2)
                        }

                        console.log(`==============${element.title}==============`)
                        this.statusPanel.updateMetrics({
                            currentTask:element.title
                        })
                        element.click()
                        const type = this.getCatalogType(element)
                        let video;
                        switch (type) {
                            // 视频
                            case 1:
                                console.log("type：视频")
                                video = await this.getStudyVideoNode(this.config.selectors.video);
                                if (video) {
                                    video.muted = true;
                                    video.play();

                                    /*setTimeout(()=>{
                                        video.pause()
                                    },60000)*/
                                    await this.waitForVideoEnd(video)
                                    if (!(await this.statusPanel.validateAuthCode())) {
                                        Swal.fire({title: '<span style="color:#FF4DAF">验证失败！</span>', /* HTML标题 */ html: `<div style="text-align:left"> <p style="margin:10px 0">未开启高级功能！</p> <ol style="padding-left:20px"> <li>前往购买链接：</li> ${this.statusPanel.linkHtml()} </ol> </div>`, icon: 'error', showConfirmButton: true, confirmButtonText: '我知道了', confirmButtonColor: '#FF4DAF', showCloseButton: true, timer: 2000, customClass: {popup: 'custom-swal-popup', title: 'custom-swal-title', content: 'custom-swal-content'}});
                                    }}
                                break;
                            case 2:
                                console.log("type：文档")
                                await this.sleep(5)
                                break;
                            case 6:
                                console.log("type：随堂小测");
                                await this.sleep(5)
                                break;
                        }}
                    await this.sleep(2)
                    const isFinish = this.validateFinish();
                    //仍未完成
                    if (!isFinish) {
                        location.reload()
                    } else {
                        this.finish()
                    }}}}
        class AutoStudyDetailOld{
            constructor(config = {}) {
                this.statusPanel=new AutomationStatusPanel()
                this.statusPanel.startMonitoring()
            }
            async init() {
                setInterval(() => {
                    const isFinish = this.validateFinish()
                    if (isFinish) {
                        this.finish()
                    } else {
                        console.log(new Date())
                        console.log("仍未完成...")
                    }
                }, 1000 * 60)
                if (!(await this.statusPanel.validateAuthCode())) {
                    Swal.fire({title: '<span style="color:#FF4DAF">验证失败！</span>', /* HTML标题 */ html: `<div style="text-align:left"> <p style="margin:10px 0">未开启高级功能！脚本不会自动填写验证码窗口！</p> <ol style="padding-left:20px"> <li>继续使用基础功能：</li> <li>自动播放</li> <li>自动下一个(自动点击阻止弹窗)</li> <li>前往<a href="/purchase" style="color:#FF4DAF;text-decoration:underline" onmouseover="this.style.color='#ff1f9f'" onmouseout="this.style.color='#FF4DAF'"> 授权码购买页面 </a>（限时特价1元） </li> </ol> </div>`, icon: 'error', showConfirmButton: true, confirmButtonText: '我知道了', confirmButtonColor: '#FF4DAF', showCloseButton: true, /* 显示关闭按钮 */ allowOutsideClick: false, /* 禁止点击外部关闭 */ allowEscapeKey: false,   /* 禁止ESC关闭 */ timer: 0,               /* 禁止自动关闭 */ customClass: {popup: 'custom-swal-popup', title: 'custom-swal-title', content: 'custom-swal-content'}});
                }else {
                    this.handleValidateCodeDialog()
                }
            }
            handleValidateCodeDialog (timeout=5000) {
                let intervalId = null; // 定时器 ID
                const checkInterHandle = async () => {
                    const dialogSelector = ".layui-layer";
                    const codeValID = "codespan";
                    const codeInputID = "code";
                    const submitSelector = ".layui-layer-btn0";
                    try {
                        // 获取验证码显示元素和输入框
                        const val = document.getElementById(codeValID);
                        const input = document.getElementById(codeInputID);
                        const subBtn = document.querySelector(submitSelector);
                        // 如果验证码弹窗存在
                        if (val && input && subBtn) {
                            console.log("检测到验证码弹窗，自动填写并提交...");
                            if (!(await this.statusPanel.validateAuthCode())) {
                                Swal.fire({title: '<span style="color:#FF4DAF">验证失败！</span>', /* HTML标题 */ html: `<div style="text-align:left"> <p style="margin:10px 0">未开启高级功能！脚本不会自动填写验证码窗口！</p> <ol style="padding-left:20px"> <li>前往<a href="/purchase" style="color:#FF4DAF;text-decoration:underline" onmouseover="this.style.color='#ff1f9f'" onmouseout="this.style.color='#FF4DAF'"> 授权码购买页面 </a>（限时特价1元） </li> </ol> </div>`, icon: 'error', showConfirmButton: true, confirmButtonText: '我知道了', confirmButtonColor: '#FF4DAF', showCloseButton: true, /* 显示关闭按钮 */ allowOutsideClick: false, /* 禁止点击外部关闭 */ allowEscapeKey: false,   /* 禁止ESC关闭 */ timer: 0,               /* 禁止自动关闭 */ customClass: {popup: 'custom-swal-popup', title: 'custom-swal-title', content: 'custom-swal-content'}});
                                if (intervalId) {
                                    clearInterval(intervalId);
                                    intervalId = setInterval(checkInterHandle, timeout);
                                }
                                return
                            }
                            // 清除定时器
                            if (intervalId) {
                                clearInterval(intervalId);
                                intervalId = null;
                            }
                            // 填写验证码
                            await this.sleep(3); // 等待 3 秒
                            input.value = val.innerText;
                            // 点击提交按钮
                            await this.sleep(3); // 等待 3 秒
                            subBtn.click();
                            console.log("验证码已自动提交");
                            // 重新设置定时器
                            intervalId = setInterval(checkInterHandle, timeout);
                        }
                    } catch (e) {
                        console.error("异步检测挂机验证错误：" + e);
                        // 发生错误时重新设置定时器
                        if (!intervalId) {
                            intervalId = setInterval(checkInterHandle, timeout);
                        }}};
                // 初始化定时器
                intervalId = setInterval(checkInterHandle, timeout);
            };
            sleep  (time) {
                return new Promise(resolve => setTimeout(resolve, time * 1000));
            }
            validateFinish (){
                const maxID="courseStudyBestMinutesNumber"
                const curID="courseStudyMinutesNumber"
                const max=document.getElementById(maxID);
                const cur=document.getElementById(curID);
                if(max && cur){
                    const maxVal=Number(max.innerText);
                    const curVal=Number(cur.innerText);
                    console.log("最大学习时间：",maxVal)
                    console.log("学习时间：",curVal)
                    if(maxVal!==0 && curVal!==0 && maxVal<=curVal ){
                        console.log("学习时间已到达最大！")
                        return true
                    }
                }
                return false;
            }
            sendMsg (msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel('my-channel');
                channel.postMessage(msg);
            }
            finish (){
                this.sendMsg('finish')
                if (Swal) {
                    Swal.fire({title: "刷课成功！", text: `学习时间已达到最大值`, icon: 'success',/* showCancelButton: true, */ confirmButtonColor: "#FF4DAFFF",/* cancelButtonText: "取消，等会刷新", */ confirmButtonText: "点击关闭页面，2s后自动关闭页面",}).then((result) => {
                        if (result.isConfirmed) {
                            // 尝试关闭当前页面
                            try {
                                window.close(); // 关闭当前页面
                            } catch (error) {
                                console.error("无法直接关闭页面：", error);
                                // 如果无法直接关闭页面，提示用户手动关闭
                                Swal.fire({title: "无法自动关闭页面", text: "请手动关闭此页面。", icon: 'warning', confirmButtonColor: "#FF4DAFFF", confirmButtonText: "确定",});
                            }}});}
                setTimeout(()=>{
                    window.close();
                },2000)
            }}
        async function main() {
            if (location.href.includes('intoStudentStudy')) {
                const autoStudy = new AutoStudyIndex({
                    catalogSelector: '.con ul li', // 自定义选择器
                });
                autoStudy.init();
                // setTimeout(() => {
                //    autoStudy.showCompletion()
                // }, 1000)
            } else if (location.href.includes("intoSelectCourseVideo")) {
                const domain = new AutoStudyDetailNew()
                await domain.init()
            } else if(location.href.includes("intoSelectCourseUrlVideo")){
                const domain=new AutoStudyDetailOld()
                domain.init()
            }}
        main().then(r => {})
        console.log('师学通平台 启动！！！');
    }}
//中国教育电视台
class HebeiCas{
    constructor() {
    }
    run(config) {
        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        class Runner {
            constructor() {
                this.runner = null
                this.run()
            }

            run() {
                const url = location.href;
                if (url.includes("newCourse/list")) {
                    this.runner = new Auto()
                } else if (url.includes("studyNew")) {
                    this.runner = new Course("channel-cas")
                    // this.runner.run()
                }
            }
        }

        class Auto {
            constructor(channel = "channel-my") {
                this.channel = channel
                // 配置常量
                this.SELECTORS = {
                    COURSE_LIST: '.list-wrap-item',
                    PROGRESS: '.el-progress__text',
                    BUTTON: '.h-button',
                    TITLE: '.title'
                };
                // 请求配置
                this.API_ENDPOINTS = {
                    WINDOW_COURSE: {
                        url: 'http://cas.study.yanxiu.jsyxsq.com/api/newCourse/windowCourse',
                        method: 'GET'
                    }
                };
                // 运行状态
                this.courseList = [];
                this.shouldStop = false;
                this.requestInterceptor = null;
                this.pannel = new AuthWindow()
                this.VIP = false
                // 初始化流程
                this.initRequestInterceptor();
                this.init()
            }

            init() {
                this.pannel.setOnBegin(() => {
                    this.run().then(r => {
                    })
                })
                this.pannel.setOnVerifyCallback((data) => {
                    Utils.validateCode(data).then(r => {
                    })
                })
                this.loadVIPStatus()
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.pannel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.pannel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP", this.VIP)
            }

            // 初始化请求拦截
            initRequestInterceptor() {
                const originalXHR = unsafeWindow.XMLHttpRequest;
                const self = this;

                this.requestInterceptor = function () {
                    const xhr = new originalXHR();
                    const originalOpen = xhr.open;
                    const originalSend = xhr.send;

                    // 重写open方法记录请求信息
                    xhr.open = function (method, url) {
                        this._requestMetadata = {method, url};
                        return originalOpen.apply(this, arguments);
                    };

                    // 重写send方法拦截响应
                    xhr.send = function (body) {
                        this.addEventListener('readystatechange', function () {
                            if (this.readyState === 4 &&
                                this._requestMetadata.url.includes(self.API_ENDPOINTS.WINDOW_COURSE.url)) {
                                try {
                                    self.API_ENDPOINTS.WINDOW_COURSE.response = JSON.parse(this.responseText);
                                    console.log("请求捕捉：", self.API_ENDPOINTS.WINDOW_COURSE.response)
                                } catch (e) {
                                    console.error(' 响应解析失败:', e);
                                }
                            }
                        });
                        originalSend.call(this, body);
                    };

                    return xhr;
                };

                unsafeWindow.XMLHttpRequest = this.requestInterceptor;
            }

            // 加载课程列表
            loadCourseList() {
                try {
                    this.courseList = Array.from(document.querySelectorAll(this.SELECTORS.COURSE_LIST));
                    console.log(` 成功加载 ${this.courseList.length}  门课程`);
                } catch (error) {
                    this.handleError(' 课程列表加载失败', error);
                }
            }

            // 主运行逻辑
            async run() {
                try {
                    this.loadCourseList();
                    for (const [index, courseItem] of this.courseList.entries()) {
                        if (this.shouldStop) {
                            console.log(' 脚本已主动停止');
                            await sleep(2000)
                            return;
                        }

                        const courseTitle = courseItem.querySelector(this.SELECTORS.TITLE)?.innerText || `课程 ${index + 1}`;
                        console.log(` 正在处理: ${courseTitle}`);

                        await this.processCourse(courseItem);

                    }
                    console.log(' 所有课程处理完成');
                } catch (error) {
                    // this.handleError(' 运行过程中发生错误', error);
                }
            }

            // 处理单个课程
            async processCourse(courseItem) {
                try {
                    if (this.isCourseCompleted(courseItem)) {
                        console.log(' 课程已完成，跳过处理');
                        return;
                    }

                    this.triggerCourseStart(courseItem);
                    const success = await this.verifyWindowOpen();

                    if (!success) {
                        throw new Error('课程窗口未正确打开');
                    }

                    const flag = await this.waitForComplete()

                } catch (error) {
                    this.handleError(' 课程处理失败', error);
                    throw error;
                }
            }

            waitForComplete(timeout) {
                return new Promise((resolve) => {
                    const inter = setInterval(() => {
                        console.log(new Date())
                        console.log("等待当前课程完成.......")
                    }, 30000)
                    const channel = new BroadcastChannel(this.channel);

                    channel.onmessage = (event) => {
                        if (event.data === 'finish') {
                            resolve(0);
                        } else if (event.data === 'again') {
                            resolve(1);
                        }
                        clearInterval(inter)
                    };


                });
            }

            // 检查课程进度
            isCourseCompleted(courseItem) {
                const progressText = courseItem.querySelector(this.SELECTORS.PROGRESS)?.innerText;
                return progressText?.includes('100%');
            }

            // 触发课程开始
            triggerCourseStart(courseItem) {
                const button = courseItem.querySelector(this.SELECTORS.BUTTON);
                if (!button) throw new Error('未找到启动按钮');
                button.click();
            }

            // 验证窗口打开状态
            async verifyWindowOpen() {
                return new Promise((resolve, reject) => {
                    const checkInterval = 2000; // 缩短检查间隔
                    const timeout = 6000;      // 超时时间
                    let elapsed = 0;

                    const intervalId = setInterval(() => {
                        elapsed += checkInterval;

                        if (this.API_ENDPOINTS.WINDOW_COURSE.response?.data) {
                            clearInterval(intervalId);
                            resolve(true);
                        }

                        if (elapsed >= timeout) {
                            clearInterval(intervalId);
                            this.showBlockingAlert('窗口打开失败', '请正常关闭窗口后，再运行脚本');
                            reject(new Error('窗口响应超时'));
                        }
                    }, checkInterval);
                });
            }

            // 显示阻断式提示
            showBlockingAlert(title, text) {
                this.shouldStop = true;
                Swal.fire({
                    title,
                    text,
                    icon: 'error',
                    confirmButtonText: '确定',
                    allowOutsideClick: false,
                    willClose: () => {
                        console.log(' 用户确认错误，脚本已停止');
                    }
                });
            }

            // 统一错误处理
            handleError(context, error) {
                console.error(`${context}:`, error);
                // this.showBlockingAlert(context, error.message);
                this.shouldStop = true;
            }

            // 停止脚本
            stop() {
                this.shouldStop = true;
                window.XMLHttpRequest = this.requestInterceptor;  // 恢复原始XHR
                console.log(' 脚本已安全停止');
            }
        }

        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow()
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：",this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if(!this.url){
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:",this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    if (!location.href.includes('studyNew')) {
                        Swal.fire({
                            title: "提示",
                            text: "请在视频播放页面使用！",
                            icon: 'info',
                            confirmButtonText: '确定',
                            willClose: () => {
                                console.log(' 用户确认错误，脚本已停止');
                            }
                        })
                    }
                    try {
                        document.querySelector('video').pause()
                    } catch (error) {
                    }
                    let jsCode = GM_getValue("jsCode")
                    if (!jsCode) {
                        jsCode = await Utils.getJsCode(this.url)
                    }
                    eval(jsCode)
                    const count = await window.VIP()
                    console.log("成功数：", count)
                    Swal.fire({
                        title: "课程极速刷取成功！",
                        text: "请尽快刷新页面或直接关闭",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                let video = await this.getStudyNode('video')
                if (video) {
                    const catalogList = await this.getStudyNode('.step', 'nodeList');
                    console.log(this.VIP)
                    if (!this.VIP) {
                        Swal.fire({
                            title: '当前是基础版',
                            text: '脚本只会自动播放第一个视频，需要连播请获取授权码',
                            icon: 'info',
                            confirmButtonText: '确定',
                            timer: 5000,
                            willClose: () => {
                                console.log(this.VIP)
                            }
                        });
                    }
                    let index = 0
                    for (const element of catalogList) {
                        element.click()
                        await sleep(2000)
                        video = await this.getStudyNode('video')
                        video.volum = 0
                        video.muted = true
                        await video.play()
                        /*setInterval(() => {
                            if (video && video.paused) {
                                video.play()
                            }
                        }, 5000)*/
                        await this.waitForVideoEnd(video)
                        // if (index !== 0 && catalogList.length > 1) {
                        //
                        // }
                        index++
                        if (!this.VIP) {
                            break
                        }
                    }
                    const onClose = () => {
                        const button = document.querySelector('.header_btn');
                        if (button) {
                            this.panel.showError("未检查到结束学习按钮！脚本不能正常关闭")
                        }
                        button.click();
                        setTimeout(() => {
                            document.querySelector('.el-button--primary').click()
                            setTimeout(() => {
                                this.sendMsg('finish')
                                return
                                // unsafeWindow.close()
                            }, 3000)
                        }, 2000)
                    }
                    if (!this.VIP) {
                        Swal.fire({
                            title: '脚本已自动完成第一个视频',
                            text: '如需连播请启用高级功能！5s后页面自动关闭！',
                            icon: 'info',
                            confirmButtonText: '确定',
                            timer: 5000,
                            willClose: () => {
                                onClose()
                            }
                        });
                        return
                    }
                    Swal.fire({
                        title: '当前课程完成！',
                        text: '脚本将在2s后关闭此页面！',
                        icon: 'success',
                        confirmButtonText: '确定',
                        timer: 2000,
                        willClose: () => {
                            onClose()
                        }
                    });

                } else {
                    this.panel.showError("未检测到视频，加载超时！")
                }

            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }
                            const btn=document.querySelector('.el-button--primary')
                            if (btn) {
                                console.log("检测到已经学习弹窗！")
                                setTimeout(()=>{
                                    btn.click()
                                },2000)
                            }
                            const mutliOption=document.querySelector('.ccQuestionDiv')
                            if (mutliOption) {
                                try {
                                    console.log("检测到内嵌选择题！")
                                    document.querySelector('#ccJumpOver').click()
                                }catch (e) {
                                    console.error(e)
                                }
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }

            sendMsg = function (msg) {
                // 创建 BroadcastChannel
                console.log("send msg：", msg)
                const channel = new BroadcastChannel(this.channel);
                channel.postMessage(msg);
            }

            getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 3000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'jsCode'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let jsCode = GM_getValue(this.flag)
                    if(!jsCode){
                        jsCode= GM_getValue("AuthData")
                    }
                    return typeof jsCode === 'string' && jsCode.length > 0
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    console.log(data);
                    let info = sessionStorage.getItem('loginMessage')
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    info = JSON.parse(info)
                    data.bindInfo = info.realName + '_' + info.userInfo.phone
                    data.website = "河北-中国教育-2024中小学幼儿园"
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)

                                }
                                reject('请求失败：' + res.response)

                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(this.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }

            static async getJsCode(url) {
                try {
                    let code = GM_getValue(this.flag)
                    // console.log(code)
                    if (!code) {
                        const jsUrl = url
                        //获取js文件，然后在这里执行，然后获得结果
                        const jsCode = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                'url': jsUrl,
                                method: 'GET',
                                onload: function (res) {
                                    console.log(res)
                                    if (res.status === 200) {
                                        const result = (res.responseText)
                                        // console.log(result)
                                        resolve(result)
                                    } else {
                                        reject('服务器拒绝：' + res.response)
                                    }
                                },
                                onerror: function (err) {
                                    console.error(err)
                                    reject('请求错误！' + err.toString())
                                }
                            })
                        })
                        code = jsCode
                            .replace(/\\/g, '\\\\')
                            .replace(/'/g, '\'')
                            .replace(/"/g, '\"')
                        GM_setValue(this.flag, code)
                    }
                    return code
                } catch (error) {
                    console.error('远程加载失败:', error);
                    throw new Error("远程加载失败")
                }
            }

            static showLinkSwal() {
                const link=[
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer:30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        window.open(link[1])
                    }
                });
            }
        }

        class AuthWindow {
            constructor() {
                this.storageKey = 'AuthData';
                this.injectGlobalStyles();
                this.initDOM();
                this.loadPersistedData();
                this.show();
                // this.startAutomation()
            }

            injectGlobalStyles() {
                GM_addStyle(`
            .auth-window { position: fixed; bottom: 10px; right: 10px; z-index: 9999; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 6px 30px rgba(0,0,0,0.15); border: 1px solid #e4e7ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 320px; transform: translateY(20px); opacity: 0; transition: all 0.3s ease; } .auth-window.visible  { transform: translateY(0); opacity: 1; } .auth-title { margin: 0 0 16px; font-size: 20px; color: #2c3e50; font-weight: 600; display: flex; align-items: center; gap: 8px; } .auth-version { font-size: 12px; color: #95a5a6; font-weight: normal; } .auth-tip { margin: 0 0 20px; color: #ffbb00; font-size: 14px; font-weight: weight; line-height: 1.5; } .input-group { margin-bottom: 18px; } .input-label { display: block; margin-bottom: 6px; color: #34495e; font-size: 14px; font-weight: 500; } .input-field { width: 80%; padding: 10px 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; } .input-field:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52,152,219,0.1); } .auth-button { width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; } .auth-button:hover { background: #2980b9; transform: translateY(-1px); } .auth-button:active { transform: translateY(0); } .error-message { color: #e74c3c; font-size: 13px; margin-top: 8px; padding: 8px; background: #fdeded; border-radius: 6px; display: none; animation: shake 0.4s; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .control-panel { opacity: 1; transform: translateY(10px); transition: all 0.3s ease; } .control-panel.visible  { opacity: 1; transform: translateY(0); } .auth-button[disabled] { background: #bdc3c7 !important; cursor: not-allowed; } .auth-window { position: fixed; right: 30px; bottom: 80px; transition: transform 0.3s ease; } .window-toggle:hover .toggle-icon { animation: bounce 0.6s; } .toggle-icon { width: 20px; height: 20px; transition: transform 0.3s ease; } @keyframes bounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } } /* VIP 按钮特效 */ .vip-btn { width: 100%; position: relative; padding: 12px 24px; border: none; border-radius: 8px; background: linear-gradient(135deg, #ffd700 0%, #ffd900 30%, #ffae00 70%, #ff8c00 100%); color: #2c1a00; font-weight: 600; font-family: 'Segoe UI', sans-serif; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; box-shadow: 0 4px 15px rgba(255, 174, 0, 0.3); } /* 辉光动画效果 */ .glow-effect::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; } /* 悬停交互 */ .vip-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 174, 0, 0.5); } .vip-btn:hover::after { opacity: 1; } /* 点击反馈 */ .vip-btn:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(255, 174, 0, 0.3); } /* 皇冠图标动画 */ .crown-icon { width: 20px; height: 20px; margin-right: 8px; vertical-align: middle; transition: transform 0.3s; } .vip-btn:hover .crown-icon { transform: rotate(10deg) scale(1.1); } /* 文字渐变特效 */ .vip-text { background: linear-gradient(45deg, #2c1a00, #5a3a00); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block; } * 弹窗容器 */ .vip-alert-popup { border: 2px solid #ffd700; border-radius: 12px; background: linear-gradient(145deg, #1a1a1a, #2d2d2d); } /* 标题区域 */ .alert-header { border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 15px; } .swal-vip-icon { color: #ffd700; font-size: 2.2em; margin-right: 8px; } /* 需求列表 */ .requirements-box { background: rgba(255,215,0,0.1); border-radius: 8px; padding: 15px; margin: 15px 0; } .requirement-item { display: flex; align-items: center; margin: 10px 0; } .number-badge { background: #ffd700; color: #000; width: 24px; height: 24px; border-radius: 50%; text-align: center; margin-right: 12px; font-weight: bold; } /* 状态标签 */ .status-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.9em; } .free-status { background: #ff4444; color: white; } /* 操作引导 */ .action-guide { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; } .step-list li { margin: 8px 0; padding-left: 8px; } .pricing-link { color: #00ff9d !important; text-decoration: underline dotted; transition: all 0.3s; } .pricing-link:hover { color: #00cc7a !important; text-decoration: underline; } /* 确认按钮 */ .vip-confirm-btn { background: linear-gradient(135deg, #ffd700 0%, #ff9900 100%) !important; border: none !important; font-weight: bold !important; transition: transform 0.2s !important; } .vip-confirm-btn:hover { transform: scale(1.05); }
        `)
            }

            initDOM() {
                this.container = document.createElement('div');
                this.container.className = 'auth-window';

                // 标题区域
                const title = document.createElement('h3');
                title.className = 'auth-title';
                title.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 7v5l3 3"/>
        </svg>
        <span>脚本控制台<span class="auth-version">v${GM_info.script.version}</span></span>
    `;

                // 提示信息
                const tip = document.createElement('p');
                tip.className = 'auth-tip';
                tip.textContent = '您正在使用基础版本，功能可能存在限制';
                this.tip = tip
                // 输入框组
                // this.phoneInput = this.createInput(' 手机/QQ号', 'text', '#phone');
                this.authInput = this.createInput(' 授权密钥', 'password', '#auth');

                // 授权链接
                const link=[
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                const authLink1 = this.createLink('authLink1',link[0],'获取授权链接1');
                const authLink2 = this.createLink('authLink2',link[1],'获取授权链接2');


                // 验证按钮
                this.verifyBtn = document.createElement('button');
                this.verifyBtn.className = 'auth-button';
                this.verifyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12l-8 8-4-4m0 0l4-4m-4 4L4 12l4-4"/>
        </svg>
        验证授权码 
    `;
                this.verifyBtn.onclick = () => this.handleVerify();

                // 启动控制面板
                this.controlPanel = document.createElement('div');
                this.controlPanel.className = 'control-panel';
                this.controlPanel.style.cssText = `
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 16px;
    `;
                this.vipBtn = document.createElement('button');
                this.vipBtn.className = 'vip-btn glow-effect';
                this.vipBtn.innerHTML = `
            <span class="glow-container"></span>
            <svg class="crown-icon" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v2h14v-2z"/>
            </svg>
            <span class="vip-text">高级功能-极速刷课</span>
        `;
                this.vipBtn.addEventListener('click', () => {
                    this.handleVIPClick()
                })
                // 计时器
                this.timerDisplay = document.createElement('div');
                this.timerDisplay.className = 'timer';
                this.timerDisplay.textContent = '运行时间: 00:00:00';
                this.timerDisplay.style.cssText = `
        color: #2ecc71;
        font-size: 13px;
        margin-bottom: 12px;
    `;

                // 开始按钮
                this.startBtn = document.createElement('button');
                this.startBtn.className = 'auth-button';
                this.startBtn.style.backgroundColor = '#2ecc71';
                this.startBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        开始运行-自动化挂机
    `;
                this.startBtn.onclick = () => this.startAutomation();

                // 错误提示
                this.errorBox = document.createElement('div');
                this.errorBox.className = 'error-message';


                // 组装结构
                this.controlPanel.append(
                    this.vipBtn,
                    this.timerDisplay,
                    this.startBtn
                );

                this.container.append(
                    title,
                    tip,
                    // this.phoneInput.container,
                    this.authInput.container,
                    authLink1,
                    authLink2,
                    this.verifyBtn,
                    this.controlPanel,
                    this.errorBox
                );

                document.body.appendChild(this.container);
                this.initControlBtn()
            }

            initControlBtn() {
                // 创建控制按钮
                this.toggleBtn = document.createElement('button');
                this.toggleBtn.className = 'window-toggle';
                this.toggleBtn.innerHTML = `
        <svg class="toggle-icon" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span class="toggle-text">展开面板</span>
    `;
                this.toggleBtn.style.cssText = `
        position: fixed;
        right: 30px;
        bottom: 30px;
        padding: 12px 20px;
        background: #fff;
        border: none;
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        z-index: 9999999;
    `;

                // 添加交互效果
                this.toggleBtn.addEventListener('mouseenter', () => {
                    this.toggleBtn.style.transform = 'translateY(-2px)';
                    this.toggleBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                });

                this.toggleBtn.addEventListener('mouseleave', () => {
                    this.toggleBtn.style.transform = 'none';
                    this.toggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                });

                // 点击事件处理
                this.toggleBtn.onclick = () => {
                    const isVisible = this.container.style.display !== 'none';
                    this.container.style.display = isVisible ? 'none' : 'block';

                    // 更新按钮状态
                    this.toggleBtn.querySelector('.toggle-icon').style.transform =
                        isVisible ? 'rotate(180deg)' : 'none';
                    this.toggleBtn.querySelector('.toggle-text').textContent =
                        isVisible ? '展开面板' : '收起面板';

                    // 添加动画效果
                    if (!isVisible) {
                        this.container.animate([
                            {opacity: 0, transform: 'translateY(20px)'},
                            {opacity: 1, transform: 'none'}
                        ], {duration: 300, easing: 'ease-out'});
                    }
                };

                document.body.appendChild(this.toggleBtn);
            }

            startAutomation(callback) {
                if (!this.isRunning) {
                    this.startTime = Date.now();
                    this.isRunning = true;
                    this.startBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 12h12"/>
            </svg>
            运行中...
        `;
                    this.startBtn.style.backgroundColor = '#e67e22';
                    this.startBtn.disabled = true;

                    // 启动计时器
                    this.timer = setInterval(() => {
                        const elapsed = Date.now() - this.startTime;
                        const hours = Math.floor(elapsed / 3600000);
                        const minutes = Math.floor((elapsed % 3600000) / 60000);
                        const seconds = Math.floor((elapsed % 60000) / 1000);
                        this.timerDisplay.textContent =
                            `运行时间: ${hours.toString().padStart(2, '0')}:` +
                            `${minutes.toString().padStart(2, '0')}:` +
                            `${seconds.toString().padStart(2, '0')}`;
                    }, 1000);

                    // 触发自动化任务
                    if (typeof callback === 'function') {
                        callback()
                    }
                    if (this.begin && typeof this.begin === 'function') {
                        this.begin()
                    }
                }
            }

            createInput(labelText, type, id) {
                const container = document.createElement('div');
                container.className = 'input-group';

                const label = document.createElement('label');
                label.className = 'input-label';
                label.textContent = labelText;
                label.htmlFor = id;

                const input = document.createElement('input');
                input.className = 'input-field';
                input.type = type;
                input.id = id;
                input.maxLength = 16
                container.appendChild(label);
                container.appendChild(input);
                return {container, input};
            }
            createLink(id,link,name){
                const authLink = document.createElement('a');
                authLink.id = id;
                authLink.className = 'auth-link';
                authLink.href = link;
                authLink.target = '_blank';
                authLink.textContent = name;
                authLink.style.cssText = `
        display: block; margin: 12px 0; color: #3498db; text-decoration: none; font-size: 13px; transition: opacity 0.2s; `;
                authLink.addEventListener('mouseenter', () => {
                    authLink.style.opacity = '0.8';
                    authLink.style.textDecoration = 'underline';
                });
                authLink.addEventListener('mouseleave', () => {
                    authLink.style.opacity = '1';
                    authLink.style.textDecoration = 'none';
                });
                return authLink
            }
            show() {
                setTimeout(() => {
                    this.container.classList.add('visible');
                }, 100);
            }

            showError(message) {
                this.errorBox.textContent = message;
                this.errorBox.style.display = 'block';
                setTimeout(() => {
                    this.errorBox.style.display = 'none';
                }, 5000);
            }

            async handleVerify() {
                const data = {
                    // phone: this.phoneInput.input.value,
                    key: this.authInput.input.value
                };
                console.log(data);
                if (!data.key || !(/^[A-Z0-9]{16}$/).test(data.key)) {
                    Swal.fire({
                        title: "授权码不正确，应为16位",
                        text: "请正确输入！",
                        icon: 'info',
                        confirmButtonText: '确定',
                    });
                    return
                }
                // 触发验证回调
                if (this.onVerify) {
                    if(await this.onVerify(data)){
                        GM_setValue(this.storageKey,JSON.stringify(data))
                    }else {

                    }
                }
            }

            handleVIPClick() {
                if (this.vipCallback) {
                    this.vipCallback()
                } else {
                    Swal.fire({
                        title: "提示",
                        text: "请在视频播放页面使用！",
                        icon: 'info',
                        confirmButtonText: '确定',
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            loadPersistedData() {
                let saved = GM_getValue(this.storageKey);
                if (saved) {
                    saved=JSON.parse(saved)
                    // this.phoneInput.input.value = saved.phone || '';
                    this.authInput.input.value = saved.key || '';
                }
            }


            hide() {
                this.container.style.display = 'none';
            }

            // get phone() {
            //     return this.phoneInput.input.value;
            // }

            // set phone(value) {
            //     this.phoneInput.input.value = value;
            // }

            get key() {
                return this.authInput.input.value;
            }

            set key(value) {
                // this.authInput.input.value = value;
            }

            setTip(text) {
                this.tip.innerText = text
            }

            // 验证回调函数
            setOnVerifyCallback(callback) {
                this.onVerify = callback;
            }

            setOnBegin(callback) {
                this.begin = callback;
            }

            setOnVIP(callback) {
                this.vipCallback = callback;
            }
        }
        new Runner()
    }

}
// 奥鹏
class HebeiAoPeng {
    constructor() {
    }
    run(config) {
        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        class Runner {
            constructor() {
                this.runner = null
                this.run()
            }

            run() {
                const url = location.href;
                if (url.includes("learn.ourteacher.com.cn/StepLearn/StepLearn/")) {
                    this.runner = new Course("channel-aopeng")
                    // this.runner.run()
                }
            }
        }

        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow()
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "现在，脚本会自动挂机，刷完当前课程学时！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {

                        }
                    });
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                const onlyTime = true
                const catalogSelecter = '.CourseLeftmenu ul a'
                const videoNodeID = 'ckplayer_video'
                const timeID = 'learnTime'


                const studyNodes = document.querySelectorAll(catalogSelecter);
                const list = Array.from(studyNodes);
                // 答题窗口 屏蔽
                const answerDialog = setInterval(() => {
                    try {
                        const dialogIframe = document.getElementById('dialog_iframe_ValidationPage').contentWindow
                        if (dialogIframe) {
                            // dialogIframe.parent.modalDialog.OKEvent()
                            location.reload()
                        }
                    } catch (e) {
                    }
                }, 5000)
                let index= 0;
                for (const node of list) {
                    index++
                    //检查学习时间
                    if (onlyTime) {
                        try {
                            const studyTime = this.getStudyTime(timeID)
                            console.log("学习时间:", studyTime)
                            const maxTime = this.getMaxStudyTime(timeID)
                            console.log("最大学习时间:", maxTime)
                            if (studyTime >= maxTime) {
                                console.log("学习时间已到达最大！直接完成！")
                                this.finish()
                                break;
                            }
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if(index>=3){
                        const VIP = Utils.loadStatus();
                        if(!VIP){
                            Swal.fire({
                                title: "基本版，只支持前三个节点自动",
                                text: "若需自动完成所有，请获取授权码.20s后页面即将自动关闭！",
                                icon: 'info',
                                confirmButtonColor: "#FF4DAFFF",
                                confirmButtonText: "我知道了",
                                showCloseButton: true, // 显示关闭按钮
                                allowOutsideClick: false, // 禁止点击外部关闭
                                allowEscapeKey: false,
                                timer: 0,
                                willClose: () => {
                                    setTimeout(()=>{
                                        window.close()
                                    },20000)
                                }
                            })
                            setTimeout(()=>{
                                window.close()
                            },20000)
                            return
                        }

                    }
                    const nodeName = node.innerText
                    console.log(`============================${nodeName}============================`)
                    node.click()
                    const nodeType = this.getStudyNodesType(node)
                    console.log("节点类型：", nodeType)
                    if (nodeType !== 2) {
                        await sleep(1000)
                        continue
                    }
                    const video = await this.getStudyVideoNode(videoNodeID)
                    // 未找到视频
                    if (!video) {
                        console.log("无视频，停顿5s");
                        await sleep(5)
                    } else {
                        video.muted = true;
                        await video.play()
                        const videoDur = video.duration
                        if (videoDur <= 0) {
                            console.error("视频无播放时长！")
                            continue
                        }
                        console.log(`开始播放视频，时长为 ${videoDur} 秒`);
                        await this.waitForVideoEnd(video); // 等待视频播放完毕
                        console.log("视频播放完毕，继续下一个");
                        //安全间隔 2s
                        await sleep(2);
                    }
                }
                if(!this.VIP){
                    return
                }
                //检查学习时间
                const studyTime = this.getStudyTime(timeID)
                const maxTime = this.getMaxStudyTime(timeID)
                console.log("最大学习时间:", maxTime)
                console.log("当前学习时长：", studyTime)
                // 如果学习时间未达到最大值
                if (studyTime < maxTime) {
                    console.log("开始挂机，随机点击");
                    // 每 10 秒随机点击一个节点
                    const intervalId = setInterval(async () => {
                        // 随机选择一个节点
                        const randomIndex = Math.floor(Math.random() * studyNodes.length);
                        const randomNode = studyNodes[randomIndex];
                        console.log(`随机点击节点：${randomNode.innerText}`);

                        randomNode.click();

                        await sleep(2000)
                        // 再次检查学习时间
                        const newStudyTime = this.getStudyTime(timeID);
                        console.log("学习时长：", newStudyTime);

                        // 如果学习时间达到最大值，停止定时器
                        if (newStudyTime >= maxTime) {
                            clearInterval(intervalId);
                            console.log("学习时间已达到最大值，挂机完成！");
                            this.finish()
                            return 0;
                        }
                    }, 10000); // 每 10 秒执行一次
                } else {
                    console.log("学习时间已达到最大值，无需挂机");
                    this.finish()
                }
            }
            finish() {
                if (Swal) {
                    Swal.fire({
                        title: "刷课成功！",
                        text: `学习时间已达到最大值`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // 尝试关闭当前页面
                            try {
                                // window.close(); // 关闭当前页面
                            } catch (error) {
                                console.error("无法直接关闭页面：", error);
                                // 如果无法直接关闭页面，提示用户手动关闭
                                Swal.fire({
                                    title: "无法自动关闭页面",
                                    text: "请手动关闭此页面。",
                                    icon: 'warning',
                                    confirmButtonColor: "#FF4DAFFF",
                                    confirmButtonText: "确定",
                                });
                            }
                        }
                    });
                }
            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }

            /**
             * 获取学习时间，返回秒数
             * @param timeId
             * @returns {number}
             */
            getStudyTime(timeId) {
                const timeString = document.getElementById(timeId).innerHTML.split('/')[0];
                const minute = parseInt(timeString.split('分')[0])
                const second = parseInt(timeString.split('分')[1].split('秒')[0])
                return minute * 60 + second
            }

            /**
             * 获取最大学习时间
             * @param timeId
             * @returns {number}
             */
            getMaxStudyTime(timeId) {
                const timeString = document.getElementById(timeId).innerHTML.split('/')[1];
                const minute = parseInt(timeString.split('分')[0])
                return minute * 60
            }

            /**
             * 检查 iframe 是否包含视频
             * @param {HTMLIFrameElement} iframe - iframe 元素
             * @returns {Promise<boolean>} - 返回是否包含视频
             */
            checkIframeForVideo(iframe) {
                return new Promise((resolve) => {
                    // 监听 iframe 的加载完成事件
                    iframe.addEventListener('load', () => {
                        try {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            // console.log(iframeDoc.location.href)
                            const iframeUrl = iframeDoc.location.href
                            if (iframeUrl.includes('Play')) {
                                // 视频
                                resolve(true)
                            } else {
                                resolve(false)
                            }
                        } catch (error) {
                            console.error("无法访问 iframe 内容：", error);
                            resolve(false);
                        }
                    }, {once: true}); // 只监听一次
                });
            };

            /**
             * 获取视频节点
             * @param {string} videoNodeID - 视频元素的 ID
             * @param {number} timeout - timeout
             * @returns {Promise<HTMLElement>}
             */
            getStudyVideoNode(videoNodeID, timeout = 10000) {
                return new Promise(async (resolve, reject) => {
                    const iframe = document.querySelector('iframe[name="rightFrame"]');
                    if (!iframe) {
                        console.error("未找到 name='rightFrame' 的 iframe");
                        resolve(null);
                    }

                    // 检查 iframe 是否包含视频
                    const hasVideo = await this.checkIframeForVideo(iframe);
                    if (!hasVideo) {
                        console.log("iframe 不包含视频");
                        resolve(null);
                        return null
                    } else {
                        console.log("包含视频，获取视频节点中...");
                    }

                    // 获取视频节点
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                        // 超时处理
                        const timeoutId = setTimeout(() => {
                            console.error("获取视频节点超时");
                            clearInterval(internal); // 清除定时器
                            resolve(null); // 返回 null
                        }, timeout);

                        // 定期检查视频节点
                        const internal = setInterval(() => {
                            try {
                                const videoNode = iframeDoc.getElementById(videoNodeID);
                                if (videoNode && videoNode.readyState >= 3) {
                                    console.log("video ready!");
                                    clearTimeout(timeoutId); // 清除超时定时器
                                    clearInterval(internal); // 清除检查定时器
                                    resolve(videoNode); // 返回视频节点
                                } else {
                                    console.log("未检查到 video，继续检查...");
                                }
                            } catch (error) {
                                console.error("检查视频节点时出错：", error);
                                clearTimeout(timeoutId); // 清除超时定时器
                                clearInterval(internal); // 清除检查定时器
                                resolve(null); // 返回 null
                            }
                        }, 1000); // 每隔 1 秒检查一次
                    } catch (error) {
                        console.error("无法访问 iframe 内容：", error);
                        resolve(null); // 返回 null
                    }
                })
            };

            /**
             * 获取目录节点类型
             * -1：失败
             * 1：有子根节点，无意义，展开子节点
             * 2：子节点
             * @param studyNode
             * @returns {number}
             */
            getStudyNodesType(studyNode) {
                if (!studyNode.id) {
                    return -1
                }
                if (studyNode.id.includes('00000000-0000-0000-0000-000000000000')) {
                    return 1
                } else {
                    return 2
                }
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'VIP'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    console.log(data);
                    let info = document.querySelector('.person').innerText
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = info
                    data.website = "河北-奥鹏"
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)

                                }
                                reject('请求失败：' + res.response)

                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(this.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(this.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }


            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }
        }

        class AuthWindow {
            constructor() {
                this.storageKey = 'AuthData';
                this.injectGlobalStyles();
                this.initDOM();
                this.loadPersistedData();
                this.show();
                // this.startAutomation()
            }

            injectGlobalStyles() {
                GM_addStyle(`
            .auth-window { position: fixed; bottom: 10px; right: 10px; z-index: 9999; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 6px 30px rgba(0,0,0,0.15); border: 1px solid #e4e7ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 320px; transform: translateY(20px); opacity: 0; transition: all 0.3s ease; } .auth-window.visible  { transform: translateY(0); opacity: 1; } .auth-title { margin: 0 0 16px; font-size: 20px; color: #2c3e50; font-weight: 600; display: flex; align-items: center; gap: 8px; } .auth-version { font-size: 12px; color: #95a5a6; font-weight: normal; } .auth-tip { margin: 0 0 20px; color: #ffbb00; font-size: 14px; font-weight: weight; line-height: 1.5; } .input-group { margin-bottom: 18px; } .input-label { display: block; margin-bottom: 6px; color: #34495e; font-size: 14px; font-weight: 500; } .input-field { width: 80%; padding: 10px 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; } .input-field:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52,152,219,0.1); } .auth-button { width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; } .auth-button:hover { background: #2980b9; transform: translateY(-1px); } .auth-button:active { transform: translateY(0); } .error-message { color: #e74c3c; font-size: 13px; margin-top: 8px; padding: 8px; background: #fdeded; border-radius: 6px; display: none; animation: shake 0.4s; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .control-panel { opacity: 1; transform: translateY(10px); transition: all 0.3s ease; } .control-panel.visible  { opacity: 1; transform: translateY(0); } .auth-button[disabled] { background: #bdc3c7 !important; cursor: not-allowed; } .auth-window { position: fixed; right: 30px; bottom: 80px; transition: transform 0.3s ease; } .window-toggle:hover .toggle-icon { animation: bounce 0.6s; } .toggle-icon { width: 20px; height: 20px; transition: transform 0.3s ease; } @keyframes bounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } } /* VIP 按钮特效 */ .vip-btn { width: 100%; position: relative; padding: 12px 24px; border: none; border-radius: 8px; background: linear-gradient(135deg, #ffd700 0%, #ffd900 30%, #ffae00 70%, #ff8c00 100%); color: #2c1a00; font-weight: 600; font-family: 'Segoe UI', sans-serif; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; box-shadow: 0 4px 15px rgba(255, 174, 0, 0.3); } /* 辉光动画效果 */ .glow-effect::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; } /* 悬停交互 */ .vip-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 174, 0, 0.5); } .vip-btn:hover::after { opacity: 1; } /* 点击反馈 */ .vip-btn:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(255, 174, 0, 0.3); } /* 皇冠图标动画 */ .crown-icon { width: 20px; height: 20px; margin-right: 8px; vertical-align: middle; transition: transform 0.3s; } .vip-btn:hover .crown-icon { transform: rotate(10deg) scale(1.1); } /* 文字渐变特效 */ .vip-text { background: linear-gradient(45deg, #2c1a00, #5a3a00); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block; } * 弹窗容器 */ .vip-alert-popup { border: 2px solid #ffd700; border-radius: 12px; background: linear-gradient(145deg, #1a1a1a, #2d2d2d); } /* 标题区域 */ .alert-header { border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 15px; } .swal-vip-icon { color: #ffd700; font-size: 2.2em; margin-right: 8px; } /* 需求列表 */ .requirements-box { background: rgba(255,215,0,0.1); border-radius: 8px; padding: 15px; margin: 15px 0; } .requirement-item { display: flex; align-items: center; margin: 10px 0; } .number-badge { background: #ffd700; color: #000; width: 24px; height: 24px; border-radius: 50%; text-align: center; margin-right: 12px; font-weight: bold; } /* 状态标签 */ .status-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.9em; } .free-status { background: #ff4444; color: white; } /* 操作引导 */ .action-guide { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; } .step-list li { margin: 8px 0; padding-left: 8px; } .pricing-link { color: #00ff9d !important; text-decoration: underline dotted; transition: all 0.3s; } .pricing-link:hover { color: #00cc7a !important; text-decoration: underline; } /* 确认按钮 */ .vip-confirm-btn { background: linear-gradient(135deg, #ffd700 0%, #ff9900 100%) !important; border: none !important; font-weight: bold !important; transition: transform 0.2s !important; } .vip-confirm-btn:hover { transform: scale(1.05); }
        `)
                GM_addStyle(` div.swal2-container { all: initial !important; /* 重置所有继承样式 */ position: fixed !important; z-index: 999999 !important; inset: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; background: rgba(0,0,0,0.4) !important; } .swal2-popup { all: initial !important; max-width: 600px !important; width: 90vw !important; min-width: 300px !important; position: relative !important; box-sizing: border-box !important; padding: 20px !important; background: white !important; border-radius: 8px !important; font-family: Arial !important; animation: none !important; } @keyframes swal2-show { 0% { transform: scale(0.9); opacity: 0 } 100% { transform: scale(1); opacity: 1 } } `);
            }

            initDOM() {
                this.container = document.createElement('div');
                this.container.className = 'auth-window';

                // 标题区域
                const title = document.createElement('h3');
                title.className = 'auth-title';
                title.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 7v5l3 3"/>
        </svg>
        <span>脚本控制台<span class="auth-version">v${GM_info.script.version}</span></span>
    `;

                // 提示信息
                const tip = document.createElement('p');
                tip.className = 'auth-tip';
                tip.textContent = '您正在使用基础版本，功能可能存在限制';
                this.tip = tip
                // 输入框组
                // this.phoneInput = this.createInput(' 手机/QQ号', 'text', '#phone');
                this.authInput = this.createInput(' 授权密钥', 'password', '#auth');

                // 授权链接
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                const authLink1 = this.createLink('authLink1', link[0], '获取授权链接1');
                const authLink2 = this.createLink('authLink2', link[1], '获取授权链接2');


                // 验证按钮
                this.verifyBtn = document.createElement('button');
                this.verifyBtn.className = 'auth-button';
                this.verifyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12l-8 8-4-4m0 0l4-4m-4 4L4 12l4-4"/>
        </svg>
        验证授权码 
    `;
                this.verifyBtn.onclick = () => this.handleVerify();

                // 启动控制面板
                this.controlPanel = document.createElement('div');
                this.controlPanel.className = 'control-panel';
                this.controlPanel.style.cssText = `
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 16px;
    `;
                this.vipBtn = document.createElement('button');
                this.vipBtn.className = 'vip-btn glow-effect';
                this.vipBtn.innerHTML = `
            <span class="glow-container"></span>
            <svg class="crown-icon" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v2h14v-2z"/>
            </svg>
            <span class="vip-text">高级功能-全自动挂机</span>
        `;
                this.vipBtn.addEventListener('click', () => {
                    this.handleVIPClick()
                })
                // 计时器
                this.timerDisplay = document.createElement('div');
                this.timerDisplay.className = 'timer';
                this.timerDisplay.textContent = '运行时间: 00:00:00';
                this.timerDisplay.style.cssText = `
        color: #2ecc71;
        font-size: 13px;
        margin-bottom: 12px;
    `;

                // 开始按钮
                this.startBtn = document.createElement('button');
                this.startBtn.className = 'auth-button';
                this.startBtn.style.backgroundColor = '#2ecc71';
                this.startBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        开始运行-自动化挂机
    `;
                this.startBtn.onclick = () => this.startAutomation();

                // 错误提示
                this.errorBox = document.createElement('div');
                this.errorBox.className = 'error-message';


                // 组装结构
                this.controlPanel.append(
                    this.vipBtn,
                    this.timerDisplay,
                    this.startBtn
                );

                this.container.append(
                    title,
                    tip,
                    // this.phoneInput.container,
                    this.authInput.container,
                    authLink1,
                    authLink2,
                    this.verifyBtn,
                    this.controlPanel,
                    this.errorBox
                );

                document.body.appendChild(this.container);
                this.initControlBtn()
            }

            initControlBtn() {
                // 创建控制按钮
                this.toggleBtn = document.createElement('button');
                this.toggleBtn.className = 'window-toggle';
                this.toggleBtn.innerHTML = `
        <svg class="toggle-icon" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span class="toggle-text">展开面板</span>
    `;
                this.toggleBtn.style.cssText = `
        position: fixed;
        right: 30px;
        bottom: 30px;
        padding: 12px 20px;
        background: #fff;
        border: none;
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        z-index: 9999999;
    `;

                // 添加交互效果
                this.toggleBtn.addEventListener('mouseenter', () => {
                    this.toggleBtn.style.transform = 'translateY(-2px)';
                    this.toggleBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                });

                this.toggleBtn.addEventListener('mouseleave', () => {
                    this.toggleBtn.style.transform = 'none';
                    this.toggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                });

                // 点击事件处理
                this.toggleBtn.onclick = () => {
                    const isVisible = this.container.style.display !== 'none';
                    this.container.style.display = isVisible ? 'none' : 'block';

                    // 更新按钮状态
                    this.toggleBtn.querySelector('.toggle-icon').style.transform =
                        isVisible ? 'rotate(180deg)' : 'none';
                    this.toggleBtn.querySelector('.toggle-text').textContent =
                        isVisible ? '展开面板' : '收起面板';

                    // 添加动画效果
                    if (!isVisible) {
                        this.container.animate([
                            {opacity: 0, transform: 'translateY(20px)'},
                            {opacity: 1, transform: 'none'}
                        ], {duration: 300, easing: 'ease-out'});
                    }
                };

                document.body.appendChild(this.toggleBtn);
            }

            startAutomation(callback) {
                if (!this.isRunning) {
                    this.startTime = Date.now();
                    this.isRunning = true;
                    this.startBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 12h12"/>
            </svg>
            运行中...
        `;
                    this.startBtn.style.backgroundColor = '#e67e22';
                    this.startBtn.disabled = true;

                    // 启动计时器
                    this.timer = setInterval(() => {
                        const elapsed = Date.now() - this.startTime;
                        const hours = Math.floor(elapsed / 3600000);
                        const minutes = Math.floor((elapsed % 3600000) / 60000);
                        const seconds = Math.floor((elapsed % 60000) / 1000);
                        this.timerDisplay.textContent =
                            `运行时间: ${hours.toString().padStart(2, '0')}:` +
                            `${minutes.toString().padStart(2, '0')}:` +
                            `${seconds.toString().padStart(2, '0')}`;
                    }, 1000);

                    // 触发自动化任务
                    if (typeof callback === 'function') {
                        callback()
                    }
                    if (this.begin && typeof this.begin === 'function') {
                        this.begin()
                    }
                }
            }

            createInput(labelText, type, id) {
                const container = document.createElement('div');
                container.className = 'input-group';

                const label = document.createElement('label');
                label.className = 'input-label';
                label.textContent = labelText;
                label.htmlFor = id;

                const input = document.createElement('input');
                input.className = 'input-field';
                input.type = type;
                input.id = id;
                input.maxLength = 16
                container.appendChild(label);
                container.appendChild(input);
                return {container, input};
            }

            createLink(id, link, name) {
                const authLink = document.createElement('a');
                authLink.id = id;
                authLink.className = 'auth-link';
                authLink.href = link;
                authLink.target = '_blank';
                authLink.textContent = name;
                authLink.style.cssText = `
        display: block; margin: 12px 0; color: #3498db; text-decoration: none; font-size: 13px; transition: opacity 0.2s; `;
                authLink.addEventListener('mouseenter', () => {
                    authLink.style.opacity = '0.8';
                    authLink.style.textDecoration = 'underline';
                });
                authLink.addEventListener('mouseleave', () => {
                    authLink.style.opacity = '1';
                    authLink.style.textDecoration = 'none';
                });
                return authLink
            }

            show() {
                setTimeout(() => {
                    this.container.classList.add('visible');
                }, 100);
            }

            showError(message) {
                this.errorBox.textContent = message;
                this.errorBox.style.display = 'block';
                setTimeout(() => {
                    this.errorBox.style.display = 'none';
                }, 5000);
            }

            async handleVerify() {
                const data = {
                    // phone: this.phoneInput.input.value,
                    key: this.authInput.input.value
                };
                console.log(data);
                if (!data.key || !(/^[A-Z0-9]{16}$/).test(data.key)) {
                    Swal.fire({
                        title: "授权码不正确，应为16位",
                        text: "请正确输入！",
                        icon: 'info',
                        confirmButtonText: '确定',
                    });
                    return
                }
                // 触发验证回调
                if (this.onVerify) {
                    if (await this.onVerify(data)) {
                        GM_setValue(this.storageKey, JSON.stringify(data))
                    } else {

                    }
                }
            }

            handleVIPClick() {
                if (this.vipCallback) {
                    this.vipCallback()
                } else {
                    Swal.fire({
                        title: "提示",
                        text: "请在视频播放页面使用！",
                        icon: 'info',
                        confirmButtonText: '确定',
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            loadPersistedData() {
                let saved = GM_getValue(this.storageKey);
                if (saved) {
                    saved = JSON.parse(saved)
                    // this.phoneInput.input.value = saved.phone || '';
                    this.authInput.input.value = saved.key || '';
                }
            }


            hide() {
                this.container.style.display = 'none';
            }

            // get phone() {
            //     return this.phoneInput.input.value;
            // }

            // set phone(value) {
            //     this.phoneInput.input.value = value;
            // }

            get key() {
                return this.authInput.input.value;
            }

            set key(value) {
                // this.authInput.input.value = value;
            }

            setTip(text) {
                this.tip.innerText = text
            }

            // 验证回调函数
            setOnVerifyCallback(callback) {
                this.onVerify = callback;
            }

            setOnBegin(callback) {
                this.begin = callback;
            }

            setOnVIP(callback) {
                this.vipCallback = callback;
            }
        }
        new Runner()
    }
}
// 高等教育出版社-2024中小学
// 基础教育教师培训网
class Chinabett {
    constructor() {
    }
    run(config) {
        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        class Runner {
            constructor() {
                this.runner = null
                this.run()
            }

            run() {
                const url = location.href;
                if (url.includes("studyduration/index")) {
                    this.runner = new Course("channel-cas")
                    // this.runner.run()
                }
            }
        }

        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow()
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if(!this.url){
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    if (window.VIPRunning) {
                        console.log("VIP Running");
                        Swal.fire({
                            title: "课程已在刷取中，请等待...",
                            text: "注意，请在视频播放时刷取！否则可能不生效！",
                            icon: 'info',
                            confirmButtonText: '确定',
                            willClose: () => {
                            }
                        });
                        return
                    }
                    Swal.fire({
                        title: "刷课已开始",
                        text: "注意，请在视频播放时刷取！否则可能不生效！刷完后请刷新页面！",
                        icon: 'info',
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                    let jsCode = GM_getValue("jsCode")
                    if (!jsCode) {
                        jsCode = await Utils.getJsCode(this.url)
                    }
                    eval(jsCode)
                    console.log(window.VIP)
                    await window.VIP()
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                const catalogList = await this.getStudyNode('dd a', 'nodeList');
                console.log(this.VIP)
                if (!this.VIP) {
                    Swal.fire({
                        title: '当前是基础版',
                        text: '脚本只会常速播放完列表视频！',
                        icon: 'info',
                        confirmButtonText: '确定',
                        timer: 5000,
                        willClose: () => {
                            console.log(this.VIP)
                        }
                    });
                }
                let i = 0
                let video
                for (i; i < catalogList.length; i++) {
                    if (catalogList[i].className !== "dd_active") {
                        continue
                    }
                    await sleep(2000)
                    video = await this.getStudyNode('video')
                    video.volum = 0
                    video.muted = true
                    await video.play()
                    /*setInterval(() => {
                        if (video && video.paused) {
                            video.play()
                        }
                    }, 5000)*/
                    await this.waitForVideoEnd(video)
                    if (!this.VIP && i > 3) {
                        break
                    }
                    try {
                        $(unsafeWindow).off('beforeunload');
                        setTimeout(() => {
                            $(unsafeWindow).off('beforeunload');
                            catalogList[i + 1].click()
                        }, 1000)
                    } catch (err) {
                        console.error(err)
                    }
                }
                const onClose = () => {
                    window.close()
                }
                if (!this.VIP && i !== catalogList.length - 1) {
                    Swal.fire({
                        title: '当前是基础版',
                        text: '脚本已自动学习完前几个视频，若有需要请获取授权码！',
                        icon: 'info',
                        confirmButtonText: '确定',
                        timer: 0,
                        willClose: () => {
                        }
                    });
                } else {
                    Swal.fire({
                        title: '当前课程完成！',
                        text: '脚本将在10s后关闭此页面！',
                        icon: 'success',
                        confirmButtonText: '确定',
                        timer: 10000,
                        willClose: () => {
                            onClose()
                        }
                    });
                }

            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }

            getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 3000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'VIP'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    console.log(data);
                    let info = $("#hidUserId").val();
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = 'userId_' + info
                    data.website = "河北-高教社-基础教育教师"
                    // console.log(data);
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)

                                }
                                reject('请求失败：' + res.response)

                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(this.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(this.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }

            static async getJsCode(url) {
                try {
                    let code = GM_getValue('jsCode')
                    if (!code) {
                        const jsUrl = url
                        //获取js文件，然后在这里执行，然后获得结果
                        const jsCode = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                'url': jsUrl,
                                method: 'GET',
                                onload: function (res) {
                                    console.log(res)
                                    if (res.status === 200) {
                                        const result = (res.responseText)
                                        // console.log(result)
                                        resolve(result)
                                    } else {
                                        reject('服务器拒绝：' + res.response)
                                    }
                                },
                                onerror: function (err) {
                                    console.error(err)
                                    reject('请求错误！' + err.toString())
                                }
                            })
                        })
                        code = jsCode
                            .replace(/\\/g, '\\\\')
                            .replace(/'/g, '\'')
                            .replace(/"/g, '\"')
                        GM_setValue('jsCode', code)
                    }
                    return code
                } catch (error) {
                    console.error('远程加载失败:', error);
                    throw new Error("远程加载失败")
                }
            }

            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        window.open(link[1])
                    }
                });
            }
        }

        class AuthWindow {
            constructor() {
                this.storageKey = 'AuthData';
                this.injectGlobalStyles();
                this.initDOM();
                this.loadPersistedData();
                this.show();
                // this.startAutomation()
            }

            injectGlobalStyles() {
                GM_addStyle(`
            .auth-window { position: fixed; bottom: 10px; right: 10px; z-index: 9999; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 6px 30px rgba(0,0,0,0.15); border: 1px solid #e4e7ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 320px; transform: translateY(20px); opacity: 0; transition: all 0.3s ease; } .auth-window.visible  { transform: translateY(0); opacity: 1; } .auth-title { margin: 0 0 16px; font-size: 20px; color: #2c3e50; font-weight: 600; display: flex; align-items: center; gap: 8px; } .auth-version { font-size: 12px; color: #95a5a6; font-weight: normal; } .auth-tip { margin: 0 0 20px; color: #ffbb00; font-size: 14px; font-weight: weight; line-height: 1.5; } .input-group { margin-bottom: 18px; } .input-label { display: block; margin-bottom: 6px; color: #34495e; font-size: 14px; font-weight: 500; } .input-field { width: 80%; padding: 10px 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; } .input-field:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52,152,219,0.1); } .auth-button { width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; } .auth-button:hover { background: #2980b9; transform: translateY(-1px); } .auth-button:active { transform: translateY(0); } .error-message { color: #e74c3c; font-size: 13px; margin-top: 8px; padding: 8px; background: #fdeded; border-radius: 6px; display: none; animation: shake 0.4s; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .control-panel { opacity: 1; transform: translateY(10px); transition: all 0.3s ease; } .control-panel.visible  { opacity: 1; transform: translateY(0); } .auth-button[disabled] { background: #bdc3c7 !important; cursor: not-allowed; } .auth-window { position: fixed; right: 30px; bottom: 80px; transition: transform 0.3s ease; } .window-toggle:hover .toggle-icon { animation: bounce 0.6s; } .toggle-icon { width: 20px; height: 20px; transition: transform 0.3s ease; } @keyframes bounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } } /* VIP 按钮特效 */ .vip-btn { width: 100%; position: relative; padding: 12px 24px; border: none; border-radius: 8px; background: linear-gradient(135deg, #ffd700 0%, #ffd900 30%, #ffae00 70%, #ff8c00 100%); color: #2c1a00; font-weight: 600; font-family: 'Segoe UI', sans-serif; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; box-shadow: 0 4px 15px rgba(255, 174, 0, 0.3); } /* 辉光动画效果 */ .glow-effect::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; } /* 悬停交互 */ .vip-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 174, 0, 0.5); } .vip-btn:hover::after { opacity: 1; } /* 点击反馈 */ .vip-btn:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(255, 174, 0, 0.3); } /* 皇冠图标动画 */ .crown-icon { width: 20px; height: 20px; margin-right: 8px; vertical-align: middle; transition: transform 0.3s; } .vip-btn:hover .crown-icon { transform: rotate(10deg) scale(1.1); } /* 文字渐变特效 */ .vip-text { background: linear-gradient(45deg, #2c1a00, #5a3a00); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block; } * 弹窗容器 */ .vip-alert-popup { border: 2px solid #ffd700; border-radius: 12px; background: linear-gradient(145deg, #1a1a1a, #2d2d2d); } /* 标题区域 */ .alert-header { border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 15px; } .swal-vip-icon { color: #ffd700; font-size: 2.2em; margin-right: 8px; } /* 需求列表 */ .requirements-box { background: rgba(255,215,0,0.1); border-radius: 8px; padding: 15px; margin: 15px 0; } .requirement-item { display: flex; align-items: center; margin: 10px 0; } .number-badge { background: #ffd700; color: #000; width: 24px; height: 24px; border-radius: 50%; text-align: center; margin-right: 12px; font-weight: bold; } /* 状态标签 */ .status-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.9em; } .free-status { background: #ff4444; color: white; } /* 操作引导 */ .action-guide { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; } .step-list li { margin: 8px 0; padding-left: 8px; } .pricing-link { color: #00ff9d !important; text-decoration: underline dotted; transition: all 0.3s; } .pricing-link:hover { color: #00cc7a !important; text-decoration: underline; } /* 确认按钮 */ .vip-confirm-btn { background: linear-gradient(135deg, #ffd700 0%, #ff9900 100%) !important; border: none !important; font-weight: bold !important; transition: transform 0.2s !important; } .vip-confirm-btn:hover { transform: scale(1.05); }
        `)
            }

            initDOM() {
                this.container = document.createElement('div');
                this.container.className = 'auth-window';

                // 标题区域
                const title = document.createElement('h3');
                title.className = 'auth-title';
                title.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 7v5l3 3"/>
        </svg>
        <span>脚本控制台<span class="auth-version">v${GM_info.script.version}</span></span>
    `;

                // 提示信息
                const tip = document.createElement('p');
                tip.className = 'auth-tip';
                tip.textContent = '您正在使用基础版本，功能可能存在限制';
                this.tip = tip
                // 输入框组
                // this.phoneInput = this.createInput(' 手机/QQ号', 'text', '#phone');
                this.authInput = this.createInput(' 授权密钥', 'password', '#auth');

                // 授权链接
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                const authLink1 = this.createLink('authLink1', link[0], '获取授权链接1');
                const authLink2 = this.createLink('authLink2', link[1], '获取授权链接2');


                // 验证按钮
                this.verifyBtn = document.createElement('button');
                this.verifyBtn.className = 'auth-button';
                this.verifyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12l-8 8-4-4m0 0l4-4m-4 4L4 12l4-4"/>
        </svg>
        验证授权码 
    `;
                this.verifyBtn.onclick = () => this.handleVerify();

                // 启动控制面板
                this.controlPanel = document.createElement('div');
                this.controlPanel.className = 'control-panel';
                this.controlPanel.style.cssText = `
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 16px;
    `;
                this.vipBtn = document.createElement('button');
                this.vipBtn.className = 'vip-btn glow-effect';
                this.vipBtn.innerHTML = `
            <span class="glow-container"></span>
            <svg class="crown-icon" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v2h14v-2z"/>
            </svg>
            <span class="vip-text">高级功能-极速刷课(视频播放时使用)</span>
        `;
                this.vipBtn.addEventListener('click', () => {
                    this.handleVIPClick()
                })
                // 计时器
                this.timerDisplay = document.createElement('div');
                this.timerDisplay.className = 'timer';
                this.timerDisplay.textContent = '运行时间: 00:00:00';
                this.timerDisplay.style.cssText = `
        color: #2ecc71;
        font-size: 13px;
        margin-bottom: 12px;
    `;

                // 开始按钮
                this.startBtn = document.createElement('button');
                this.startBtn.className = 'auth-button';
                this.startBtn.style.backgroundColor = '#2ecc71';
                this.startBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        开始运行-自动化挂机
    `;
                this.startBtn.onclick = () => this.startAutomation();

                // 错误提示
                this.errorBox = document.createElement('div');
                this.errorBox.className = 'error-message';


                // 组装结构
                this.controlPanel.append(
                    this.vipBtn,
                    this.timerDisplay,
                    this.startBtn
                );

                this.container.append(
                    title,
                    tip,
                    // this.phoneInput.container,
                    this.authInput.container,
                    authLink1,
                    authLink2,
                    this.verifyBtn,
                    this.controlPanel,
                    this.errorBox
                );

                document.body.appendChild(this.container);
                this.initControlBtn()
            }

            initControlBtn() {
                // 创建控制按钮
                this.toggleBtn = document.createElement('button');
                this.toggleBtn.className = 'window-toggle';
                this.toggleBtn.innerHTML = `
        <svg class="toggle-icon" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span class="toggle-text">展开面板</span>
    `;
                this.toggleBtn.style.cssText = `
        position: fixed;
        right: 30px;
        bottom: 30px;
        padding: 12px 20px;
        background: #fff;
        border: none;
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        z-index: 9999999;
    `;

                // 添加交互效果
                this.toggleBtn.addEventListener('mouseenter', () => {
                    this.toggleBtn.style.transform = 'translateY(-2px)';
                    this.toggleBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                });

                this.toggleBtn.addEventListener('mouseleave', () => {
                    this.toggleBtn.style.transform = 'none';
                    this.toggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                });

                // 点击事件处理
                this.toggleBtn.onclick = () => {
                    const isVisible = this.container.style.display !== 'none';
                    this.container.style.display = isVisible ? 'none' : 'block';

                    // 更新按钮状态
                    this.toggleBtn.querySelector('.toggle-icon').style.transform =
                        isVisible ? 'rotate(180deg)' : 'none';
                    this.toggleBtn.querySelector('.toggle-text').textContent =
                        isVisible ? '展开面板' : '收起面板';

                    // 添加动画效果
                    if (!isVisible) {
                        this.container.animate([
                            {opacity: 0, transform: 'translateY(20px)'},
                            {opacity: 1, transform: 'none'}
                        ], {duration: 300, easing: 'ease-out'});
                    }
                };

                document.body.appendChild(this.toggleBtn);
            }

            startAutomation(callback) {
                if (!this.isRunning) {
                    this.startTime = Date.now();
                    this.isRunning = true;
                    this.startBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 12h12"/>
            </svg>
            运行中...
        `;
                    this.startBtn.style.backgroundColor = '#e67e22';
                    this.startBtn.disabled = true;

                    // 启动计时器
                    this.timer = setInterval(() => {
                        const elapsed = Date.now() - this.startTime;
                        const hours = Math.floor(elapsed / 3600000);
                        const minutes = Math.floor((elapsed % 3600000) / 60000);
                        const seconds = Math.floor((elapsed % 60000) / 1000);
                        this.timerDisplay.textContent =
                            `运行时间: ${hours.toString().padStart(2, '0')}:` +
                            `${minutes.toString().padStart(2, '0')}:` +
                            `${seconds.toString().padStart(2, '0')}`;
                    }, 1000);

                    // 触发自动化任务
                    if (typeof callback === 'function') {
                        callback()
                    }
                    if (this.begin && typeof this.begin === 'function') {
                        this.begin()
                    }
                }
            }

            createInput(labelText, type, id) {
                const container = document.createElement('div');
                container.className = 'input-group';

                const label = document.createElement('label');
                label.className = 'input-label';
                label.textContent = labelText;
                label.htmlFor = id;

                const input = document.createElement('input');
                input.className = 'input-field';
                input.type = type;
                input.id = id;
                input.maxLength = 16
                container.appendChild(label);
                container.appendChild(input);
                return {container, input};
            }

            createLink(id, link, name) {
                const authLink = document.createElement('a');
                authLink.id = id;
                authLink.className = 'auth-link';
                authLink.href = link;
                authLink.target = '_blank';
                authLink.textContent = name;
                authLink.style.cssText = `
        display: block; margin: 12px 0; color: #3498db; text-decoration: none; font-size: 13px; transition: opacity 0.2s; `;
                authLink.addEventListener('mouseenter', () => {
                    authLink.style.opacity = '0.8';
                    authLink.style.textDecoration = 'underline';
                });
                authLink.addEventListener('mouseleave', () => {
                    authLink.style.opacity = '1';
                    authLink.style.textDecoration = 'none';
                });
                return authLink
            }

            show() {
                setTimeout(() => {
                    this.container.classList.add('visible');
                }, 100);
            }

            showError(message) {
                this.errorBox.textContent = message;
                this.errorBox.style.display = 'block';
                setTimeout(() => {
                    this.errorBox.style.display = 'none';
                }, 5000);
            }

            async handleVerify() {
                const data = {
                    // phone: this.phoneInput.input.value,
                    key: this.authInput.input.value
                };
                console.log(data);
                if (!data.key || !(/^[A-Z0-9]{16}$/).test(data.key)) {
                    Swal.fire({
                        title: "授权码不正确，应为16位",
                        text: "请正确输入！",
                        icon: 'info',
                        confirmButtonText: '确定',
                    });
                    return
                }
                // 触发验证回调
                if (this.onVerify) {
                    if (await this.onVerify(data)) {
                        GM_setValue(this.storageKey, JSON.stringify(data))
                    } else {

                    }
                }
            }
            handleVIPClick() {
                if (this.vipCallback) {
                    this.vipCallback()
                } else {
                    Swal.fire({
                        title: "提示",
                        text: "请在视频播放页面使用！",
                        icon: 'info',
                        confirmButtonText: '确定',
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }
            loadPersistedData() {
                let saved = GM_getValue(this.storageKey);
                if (saved) {
                    saved = JSON.parse(saved)
                    // this.phoneInput.input.value = saved.phone || '';
                    this.authInput.input.value = saved.key || '';
                }
            }
            hide() {
                this.container.style.display = 'none';
            }
            get key() {
                return this.authInput.input.value;
            }
            set key(value) {
                // this.authInput.input.value = value;
            }
            setTip(text) {
                this.tip.innerText = text
            }
            setOnVerifyCallback(callback) {
                this.onVerify = callback;
            }
            setOnBegin(callback) {
                this.begin = callback;
            }
            setOnVIP(callback) {
                this.vipCallback = callback;
            }
        }
        new Runner()
    }
}
const sleep = function (time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
new ScriptCore()