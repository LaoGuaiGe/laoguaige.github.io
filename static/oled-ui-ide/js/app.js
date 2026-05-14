const App = (() => {
    let canvas, ctx;
    let running = false;
    let interruptTimer = null;
    let keyState = { enter: 1, back: 1, up: 1, down: 1 };
    let encoderDelta = 0;

    const defaultProject = {
        pages: [],
        rootPageId: null
    };

    let project = JSON.parse(JSON.stringify(defaultProject));

    function createDefaultProject() {
        const mainPage = createPage('MainMenu', {
            menuType: UI.MENU_TYPE_TILES_ARC,
            fontSize: 20, cursorStyle: UI.NOT_SHOW,
            lineSpace: 8, moveStyle: 0, movingSpeed: 10,
            tileWidth: 32, tileHeight: 32
        });
        const settingsPage = createPage('Settings', {
            menuType: UI.MENU_TYPE_LIST,
            fontSize: 12, cursorStyle: UI.REVERSE_ROUNDRECTANGLE,
            lineSpace: 4, moveStyle: 0, movingSpeed: 10,
            parentPageId: mainPage.id, drawLinePrefix: true,
            menuArea: { x: 1, y: 1, w: 126, h: 62 }, startPointX: 4, startPointY: 2
        });
        const demosPage = createPage('Demos', {
            menuType: UI.MENU_TYPE_LIST,
            fontSize: 12, cursorStyle: UI.REVERSE_ROUNDRECTANGLE,
            lineSpace: 4, moveStyle: 0, movingSpeed: 10,
            parentPageId: mainPage.id, drawLinePrefix: true,
            menuArea: { x: 1, y: 1, w: 126, h: 62 }, startPointX: 4, startPointY: 2
        });
        const stylesPage = createPage('Styles', {
            menuType: UI.MENU_TYPE_LIST,
            fontSize: 12, cursorStyle: UI.REVERSE_ROUNDRECTANGLE,
            lineSpace: 4, moveStyle: 0, movingSpeed: 10,
            parentPageId: mainPage.id, drawLinePrefix: true,
            menuArea: { x: 1, y: 1, w: 126, h: 62 }, startPointX: 4, startPointY: 2
        });

        // Font demo pages
        const font8Page = createPage('Font8', {
            menuType: UI.MENU_TYPE_LIST, fontSize: 8, cursorStyle: UI.REVERSE_ROUNDRECTANGLE,
            lineSpace: 5, moveStyle: 0, movingSpeed: 10, parentPageId: demosPage.id,
            drawLinePrefix: true, menuArea: { x: 0, y: 0, w: 128, h: 64 }, startPointX: 4, startPointY: 2
        });
        const font12Page = createPage('Font12', {
            menuType: UI.MENU_TYPE_LIST, fontSize: 12, cursorStyle: UI.REVERSE_ROUNDRECTANGLE,
            lineSpace: 4, moveStyle: 0, movingSpeed: 10, parentPageId: demosPage.id,
            drawLinePrefix: true, menuArea: { x: 0, y: 0, w: 128, h: 64 }, startPointX: 4, startPointY: 2
        });
        const font16Page = createPage('Font16', {
            menuType: UI.MENU_TYPE_LIST, fontSize: 16, cursorStyle: UI.REVERSE_ROUNDRECTANGLE,
            lineSpace: 5, moveStyle: 0, movingSpeed: 10, parentPageId: demosPage.id,
            drawLinePrefix: true, menuArea: { x: 0, y: 0, w: 128, h: 64 }, startPointX: 4, startPointY: 2
        });
        const font20Page = createPage('Font20', {
            menuType: UI.MENU_TYPE_LIST, fontSize: 20, cursorStyle: UI.REVERSE_ROUNDRECTANGLE,
            lineSpace: 10, moveStyle: 0, movingSpeed: 10, parentPageId: demosPage.id,
            drawLinePrefix: true, menuArea: { x: 0, y: 0, w: 128, h: 64 }, startPointX: 4, startPointY: 2
        });
        const longListPage = createPage('LongList', {
            menuType: UI.MENU_TYPE_LIST, fontSize: 12, cursorStyle: UI.REVERSE_ROUNDRECTANGLE,
            lineSpace: 4, moveStyle: 0, movingSpeed: 10, parentPageId: demosPage.id,
            drawLinePrefix: true, menuArea: { x: 0, y: 0, w: 128, h: 64 }, startPointX: 4, startPointY: 2
        });
        const springPage = createPage('Spring', {
            menuType: UI.MENU_TYPE_LIST, fontSize: 12, cursorStyle: UI.REVERSE_ROUNDRECTANGLE,
            lineSpace: 4, moveStyle: 1, movingSpeed: 10, parentPageId: demosPage.id,
            drawLinePrefix: true, menuArea: { x: 0, y: 0, w: 128, h: 64 }, startPointX: 4, startPointY: 2
        });
        const smallAreaPage = createPage('SmallArea', {
            menuType: UI.MENU_TYPE_LIST, fontSize: 12, cursorStyle: UI.REVERSE_ROUNDRECTANGLE,
            lineSpace: 6, moveStyle: 0, movingSpeed: 10, parentPageId: demosPage.id,
            drawLinePrefix: true, drawFrame: true,
            menuArea: { x: 10, y: 10, w: 60, h: 36 }, startPointX: 4, startPointY: 2
        });

        // Menu style demo pages
        const listStylePage = createPage('ListStyle', {
            menuType: UI.MENU_TYPE_LIST, fontSize: 12, cursorStyle: UI.REVERSE_ROUNDRECTANGLE,
            lineSpace: 4, moveStyle: 0, movingSpeed: 10, parentPageId: stylesPage.id,
            drawLinePrefix: true, menuArea: { x: 1, y: 1, w: 126, h: 62 }, startPointX: 4, startPointY: 2
        });
        const tilesStylePage = createPage('TilesStyle', {
            menuType: UI.MENU_TYPE_TILES, fontSize: 16, cursorStyle: UI.NOT_SHOW,
            lineSpace: 8, moveStyle: 0, movingSpeed: 10, parentPageId: stylesPage.id,
            tileWidth: 32, tileHeight: 32
        });
        const depthStylePage = createPage('DepthStyle', {
            menuType: UI.MENU_TYPE_TILES_DEPTH, fontSize: 16, cursorStyle: UI.NOT_SHOW,
            lineSpace: 8, moveStyle: 0, movingSpeed: 10, parentPageId: stylesPage.id,
            tileWidth: 32, tileHeight: 32
        });
        const hopeStylePage = createPage('HopeStyle', {
            menuType: UI.MENU_TYPE_TILES_HOPE, fontSize: 16, cursorStyle: UI.NOT_SHOW,
            lineSpace: 8, moveStyle: 0, movingSpeed: 10, parentPageId: stylesPage.id,
            tileWidth: 32, tileHeight: 32
        });
        const arcStylePage = createPage('ArcStyle', {
            menuType: UI.MENU_TYPE_TILES_ARC, fontSize: 16, cursorStyle: UI.NOT_SHOW,
            lineSpace: 8, moveStyle: 0, movingSpeed: 10, parentPageId: stylesPage.id,
            tileWidth: 32, tileHeight: 32
        });

        // Main menu items
        addItem(mainPage.id, { text: 'Settings', subMenuPageId: settingsPage.id });
        addItem(mainPage.id, { text: 'Demos', subMenuPageId: demosPage.id });
        addItem(mainPage.id, { text: 'Styles', subMenuPageId: stylesPage.id });
        addItem(mainPage.id, { text: 'About' });

        // Settings items
        addItem(settingsPage.id, { text: 'Brightness', callbackType: 'window' });
        addItem(settingsPage.id, { text: 'Volume', callbackType: 'window' });
        addItem(settingsPage.id, { text: 'Dark Mode', radioBox: true });
        addItem(settingsPage.id, { text: 'Show FPS', radioBox: false });
        addItem(settingsPage.id, { text: '[Back]', callbackType: 'back' });

        // Demos items
        addItem(demosPage.id, { text: '[Back]', callbackType: 'back' });
        addItem(demosPage.id, { text: 'Font 8px', subMenuPageId: font8Page.id });
        addItem(demosPage.id, { text: 'Font 12px', subMenuPageId: font12Page.id });
        addItem(demosPage.id, { text: 'Font 16px', subMenuPageId: font16Page.id });
        addItem(demosPage.id, { text: 'Font 20px', subMenuPageId: font20Page.id });
        addItem(demosPage.id, { text: 'Long List (50)', subMenuPageId: longListPage.id });
        addItem(demosPage.id, { text: 'Spring Anim', subMenuPageId: springPage.id });
        addItem(demosPage.id, { text: 'Small Area', subMenuPageId: smallAreaPage.id });
        addItem(demosPage.id, { text: 'Text Window', callbackType: 'textWindow' });
        addItem(demosPage.id, { text: 'Float Slider', callbackType: 'floatWindow' });
        addItem(demosPage.id, { text: 'Int Slider', callbackType: 'intWindow' });

        // Styles items
        addItem(stylesPage.id, { text: '[Back]', callbackType: 'back' });
        addItem(stylesPage.id, { text: 'List', subMenuPageId: listStylePage.id });
        addItem(stylesPage.id, { text: 'Tiles', subMenuPageId: tilesStylePage.id });
        addItem(stylesPage.id, { text: 'Depth', subMenuPageId: depthStylePage.id });
        addItem(stylesPage.id, { text: 'HOPE', subMenuPageId: hopeStylePage.id });
        addItem(stylesPage.id, { text: 'Arc', subMenuPageId: arcStylePage.id });

        // Font 8 items
        addItem(font8Page.id, { text: '[Back]', callbackType: 'back' });
        addItem(font8Page.id, { text: 'English Text' });
        addItem(font8Page.id, { text: '1234567890' });
        addItem(font8Page.id, { text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' });
        addItem(font8Page.id, { text: 'abcdefghijklmnopqrstuvwxyz' });
        addItem(font8Page.id, { text: ',.[]!@#$+-/^&*()' });

        // Font 12 items
        addItem(font12Page.id, { text: '[Back]', callbackType: 'back' });
        addItem(font12Page.id, { text: 'English Text' });
        addItem(font12Page.id, { text: '1234567890' });
        addItem(font12Page.id, { text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' });
        addItem(font12Page.id, { text: 'abcdefghijklmnopqrstuvwxyz' });

        // Font 16 items
        addItem(font16Page.id, { text: '[Back]', callbackType: 'back' });
        addItem(font16Page.id, { text: 'English Text' });
        addItem(font16Page.id, { text: '1234567890' });
        addItem(font16Page.id, { text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' });

        // Font 20 items
        addItem(font20Page.id, { text: '[Back]', callbackType: 'back' });
        addItem(font20Page.id, { text: 'English Text' });
        addItem(font20Page.id, { text: '1234567890' });
        addItem(font20Page.id, { text: 'ABCDEFGHIJKLMNOP' });

        // Long list items (50 items)
        addItem(longListPage.id, { text: '[Back]', callbackType: 'back' });
        for (let i = 1; i <= 50; i++) addItem(longListPage.id, { text: 'Item ' + i });

        // Spring animation items
        addItem(springPage.id, { text: '[Back]', callbackType: 'back' });
        addItem(springPage.id, { text: 'English Text' });
        addItem(springPage.id, { text: '1234567890' });
        addItem(springPage.id, { text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' });
        addItem(springPage.id, { text: 'abcdefghijklmnopqrstuvwxyz' });
        addItem(springPage.id, { text: 'Spring bounce effect' });

        // Small area items
        addItem(smallAreaPage.id, { text: '[Back]', callbackType: 'back' });
        addItem(smallAreaPage.id, { text: 'Text A' });
        addItem(smallAreaPage.id, { text: 'Text B' });
        addItem(smallAreaPage.id, { text: 'Text C' });
        addItem(smallAreaPage.id, { text: 'Text D' });
        addItem(smallAreaPage.id, { text: 'Text E' });

        // Style demo items (shared across all style pages)
        const styleDemoItems = [
            { text: 'Item A' }, { text: 'Item B' }, { text: 'Item C' },
            { text: 'Item D' }, { text: 'Item E' }
        ];
        for (const pg of [listStylePage, tilesStylePage, depthStylePage, hopeStylePage, arcStylePage]) {
            addItem(pg.id, { text: '[Back]', callbackType: 'back' });
            for (const it of styleDemoItems) addItem(pg.id, { text: it.text });
        }

        project.rootPageId = mainPage.id;
    }

    let nextId = 1;
    function genId() { return 'p' + (nextId++); }

    function createPage(name, opts) {
        const page = {
            id: genId(),
            name: name || 'NewPage',
            menuType: 0, fontSize: 12, cursorStyle: 1,
            lineSpace: 4, moveStyle: 0, movingSpeed: 10,
            tileWidth: 32, tileHeight: 32,
            parentPageId: null, drawLinePrefix: true,
            menuArea: { x: 1, y: 1, w: 126, h: 62 },
            startPointX: 4, startPointY: 2,
            items: [],
            ...opts
        };
        project.pages.push(page);
        return page;
    }

    function addItem(pageId, opts) {
        const page = project.pages.find(p => p.id === pageId);
        if (!page) return null;
        const item = {
            text: 'New Item',
            subMenuPageId: null,
            callbackType: 'none',
            radioBox: undefined,
            icon: null,
            ...opts
        };
        page.items.push(item);
        return item;
    }

    function buildRuntimePage(pageData) {
        const rt = {
            menuType: pageData.menuType,
            fontSize: pageData.fontSize,
            cursorStyle: pageData.cursorStyle,
            lineSpace: pageData.lineSpace,
            moveStyle: pageData.moveStyle,
            movingSpeed: pageData.movingSpeed,
            tileWidth: pageData.tileWidth,
            tileHeight: pageData.tileHeight,
            screenWidth: 128,
            screenHeight: 64,
            drawLinePrefix: pageData.drawLinePrefix,
            drawFrame: pageData.drawFrame || false,
            menuArea: pageData.menuArea,
            startPointX: pageData.startPointX,
            startPointY: pageData.startPointY,
            parentPage: null,
            items: [],
            _activeMenuID: 0,
            _slot: 0,
            _ifInit: false,
            _dataId: pageData.id
        };
        return rt;
    }

    function buildRuntimePages() {
        const rtPages = {};
        for (const p of project.pages) {
            rtPages[p.id] = buildRuntimePage(p);
        }
        // Link parents and submenus
        for (const p of project.pages) {
            const rt = rtPages[p.id];
            if (p.parentPageId && rtPages[p.parentPageId]) {
                rt.parentPage = rtPages[p.parentPageId];
            }
            for (const item of p.items) {
                const rtItem = {
                    text: item.text,
                    subMenuPage: item.subMenuPageId ? rtPages[item.subMenuPageId] : null,
                    callback: null,
                    radioBox: item.radioBox !== undefined ? item.radioBox : undefined,
                    icon: item.icon || null,
                    _lineSlip: 0
                };
                if (item.callbackType === 'back') {
                    rtItem.callback = () => UI.goBack();
                } else if (item.callbackType === 'textWindow') {
                    const wc = item.windowConfig || { width: 75, height: 18 };
                    rtItem.callback = () => UI.createWindow({
                        width: wc.width || 75, height: wc.height || 18, text: item.text,
                        textFontSize: 12, textSideDistance: 6, textTopDistance: 2,
                        windowType: 1, continueTime: 2
                    });
                } else if (item.callbackType === 'floatWindow') {
                    const wc = item.windowConfig || { width: 80, height: 28, min: -10, max: 10, step: 0.1, value: 0.5 };
                    rtItem.callback = () => UI.createWindow({
                        width: wc.width || 80, height: wc.height || 28, text: item.text,
                        textFontSize: 12, textSideDistance: 4, textTopDistance: 3,
                        windowType: 1, continueTime: 4,
                        dataPtr: { value: wc.value || 0 }, dataStep: wc.step || 0.1,
                        minData: wc.min !== undefined ? wc.min : -10,
                        maxData: wc.max !== undefined ? wc.max : 10,
                        isFloat: true, sideDistance: 4, bottomDistance: 3, lineHeight: 8
                    });
                } else if (item.callbackType === 'intWindow') {
                    const wc = item.windowConfig || { width: 80, height: 28, min: 0, max: 255, step: 5, value: 50 };
                    rtItem.callback = () => UI.createWindow({
                        width: wc.width || 80, height: wc.height || 28, text: item.text,
                        textFontSize: 12, textSideDistance: 4, textTopDistance: 3,
                        windowType: 1, continueTime: 4,
                        dataPtr: { value: wc.value || 0 }, dataStep: wc.step || 5,
                        minData: wc.min !== undefined ? wc.min : 0,
                        maxData: wc.max !== undefined ? wc.max : 255,
                        sideDistance: 4, bottomDistance: 3, lineHeight: 8
                    });
                } else if (item.callbackType === 'window') {
                    const wc = item.windowConfig || { width: 80, height: 28, min: 0, max: 100, step: 5, value: 50 };
                    rtItem.callback = () => UI.createWindow({
                        width: wc.width || 80, height: wc.height || 28, text: item.text,
                        textFontSize: 12, textSideDistance: 4, textTopDistance: 3,
                        windowType: 1, continueTime: 4,
                        dataPtr: { value: wc.value || 0 }, dataStep: wc.step || 5,
                        minData: wc.min !== undefined ? wc.min : 0,
                        maxData: wc.max !== undefined ? wc.max : 100,
                        sideDistance: 4, bottomDistance: 3, lineHeight: 8
                    });
                }
                rt.items.push(rtItem);
            }
        }
        return rtPages;
    }

    function rebuildAndInit() {
        const rtPages = buildRuntimePages();
        const rootRt = rtPages[project.rootPageId];
        if (!rootRt) return;

        if (UI.currentPage) {
            const currentDataId = UI.currentPage._dataId;
            const newPage = currentDataId ? rtPages[currentDataId] : rootRt;
            if (newPage) {
                newPage._activeMenuID = UI.currentPage._activeMenuID || 0;
                newPage._slot = UI.currentPage._slot || 0;
                newPage._ifInit = true;
                UI.currentPage = newPage;
                const count = UI.getItemCount(newPage);
                if (newPage._activeMenuID >= count) {
                    newPage._activeMenuID = Math.max(0, count - 1);
                }
                // Recalculate animation targets for the updated page
                UI.lineStep.target = newPage.lineSpace || 4;
                if (newPage.menuType >= UI.MENU_TYPE_TILES) {
                    const screenW = newPage.screenWidth || 128;
                    const tileW = newPage.tileWidth || 32;
                    UI.pageStart.x.target = screenW / 2 - tileW / 2 - newPage._activeMenuID * (tileW + (newPage.lineSpace || 8));
                } else {
                    const area = newPage.menuArea || { x: 1, y: 1, w: 126, h: 62 };
                    const slot = newPage._slot || 0;
                    const fontSize = newPage.fontSize || 12;
                    UI.pageStart.x.target = area.x + (newPage.startPointX || 4);
                    UI.pageStart.y.target = area.y + (newPage.startPointY || 2) - slot * (fontSize + (newPage.lineSpace || 4));
                    UI.menuFrame.x.target = area.x;
                    UI.menuFrame.y.target = area.y;
                    UI.menuFrame.w.target = area.w;
                    UI.menuFrame.h.target = area.h;
                }
            } else {
                UI.init(rootRt);
            }
        } else {
            UI.init(rootRt);
        }
        saveProject();
    }

    function saveProject() {
        try {
            const json = JSON.stringify(project);
            if (json.length > 4 * 1024 * 1024) {
                console.warn('Project too large for localStorage (' + (json.length / 1024).toFixed(0) + 'KB), skipping auto-save');
                return;
            }
            localStorage.setItem('oled_ui_project', json);
        } catch(e) {
            if (e.name === 'QuotaExceededError') {
                console.warn('localStorage quota exceeded, auto-save disabled');
            }
        }
    }

    function start() {
        canvas = document.getElementById('oled-canvas');
        ctx = canvas.getContext('2d');

        // Load from localStorage or create default
        const saved = localStorage.getItem('oled_ui_project');
        if (saved) {
            try {
                project = JSON.parse(saved);
                // Restore nextId to avoid collisions
                for (const p of project.pages) {
                    const num = parseInt(p.id.replace('p', ''));
                    if (num >= nextId) nextId = num + 1;
                }
            } catch(e) { createDefaultProject(); }
        } else {
            createDefaultProject();
        }
        rebuildAndInit();

        Fonts.loadChineseFonts('/static/oled-ui-ide/fonts').catch(() => {});

        running = true;
        interruptTimer = setInterval(() => {
            UI.interruptHandler();
        }, 20);

        requestAnimationFrame(loop);
        setupInput();
        Editor.init();
    }

    function loop() {
        if (!running) return;
        UI.setInput(keyState, encoderDelta);
        encoderDelta = 0;
        UI.mainLoop();
        OLED.renderToCanvas(ctx, 4, [0, 180, 255], [0, 5, 15]);
        requestAnimationFrame(loop);
    }

    function setupInput() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp': case 'w': case 'W': keyState.up = 0; break;
                case 'ArrowDown': case 's': case 'S': keyState.down = 0; break;
                case 'Enter': case ' ': keyState.enter = 0; e.preventDefault(); break;
                case 'Escape': case 'Backspace': keyState.back = 0; e.preventDefault(); break;
            }
        });
        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowUp': case 'w': case 'W': keyState.up = 1; break;
                case 'ArrowDown': case 's': case 'S': keyState.down = 1; break;
                case 'Enter': case ' ': keyState.enter = 1; break;
                case 'Escape': case 'Backspace': keyState.back = 1; break;
            }
        });
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            encoderDelta += e.deltaY > 0 ? 1 : -1;
        }, { passive: false });

        // On-screen buttons
        const btnMap = { 'btn-up': 'up', 'btn-down': 'down', 'btn-enter': 'enter', 'btn-back': 'back' };
        for (const [id, k] of Object.entries(btnMap)) {
            const el = document.getElementById(id);
            if (!el) continue;
            el.addEventListener('mousedown', () => { keyState[k] = 0; });
            el.addEventListener('mouseup', () => { keyState[k] = 1; });
            el.addEventListener('mouseleave', () => { keyState[k] = 1; });
            el.addEventListener('touchstart', (e) => { e.preventDefault(); keyState[k] = 0; });
            el.addEventListener('touchend', (e) => { e.preventDefault(); keyState[k] = 1; });
        }
    }

    function getProject() { return project; }
    function setProject(p) { project = p; rebuildAndInit(); saveProject(); }

    return { start, getProject, setProject, createPage, addItem, rebuildAndInit, buildRuntimePages, genId };
})();

window.addEventListener('DOMContentLoaded', () => App.start());
