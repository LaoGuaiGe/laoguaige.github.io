// Window rendering
UI.renderWindow = function() {
    if (!this.currentWindow || !this.windowFlag) return;
    const w = this.currentWindow;
    const ww = Math.round(this.windowAnim.w.current);
    const wh = Math.round(this.windowAnim.h.current);
    if (ww < 4 || wh < 4) return;
    const wx = Math.round(64 - ww / 2);
    const wy = Math.round(32 - wh / 2);

    OLED.clearArea(wx, wy, ww, wh);
    if (w.windowType === 1) OLED.drawRoundedRect(wx, wy, ww, wh, 3, false);
    else OLED.drawRect(wx, wy, ww, wh, false);

    if (w.text) {
        const textFontSize = w.textFontSize || 12;
        const textSide = w.textSideDistance || 4;
        const textTop = w.textTopDistance || 3;
        const dataTextDist = 4;

        // MaxLength: available width for text (subtract data display width if present)
        let maxLength = ww - 2 * textSide;
        if (w.dataPtr !== undefined) {
            const valStr = Number.isInteger(w.dataPtr.value) ? String(w.dataPtr.value) : w.dataPtr.value.toFixed(1);
            const dataW = this.calcTextWidth(valStr, textFontSize);
            maxLength = ww - 2 * textSide - dataW - dataTextDist;
        }

        const textW = this.calcTextWidth(w.text, textFontSize);

        // Scrolling logic
        if (textW > maxLength) {
            if (w._lineSlip === undefined) w._lineSlip = 0;
            w._lineSlip -= 0.5;
            if (w._lineSlip < -textW) w._lineSlip = maxLength + 1;
        } else {
            w._lineSlip = 0;
        }

        // Draw text clipped to area (areaX, areaY, areaW, areaH)
        this.showMixStringArea(
            wx + textSide, wy + textTop, maxLength, textFontSize,
            wx + textSide + (w._lineSlip || 0), wy + textTop,
            w.text, textFontSize);
    }

    if (w.dataPtr !== undefined) {
        const pbX = wx + (w.sideDistance || 4);
        const pbY = wy + wh - (w.bottomDistance || 3) - (w.lineHeight || 8);
        const pbW = ww - 2 * (w.sideDistance || 4);
        const pbH = w.lineHeight || 8;
        OLED.drawRoundedRect(pbX, pbY, pbW, pbH, 2, false);
        const ratio = Math.max(0, Math.min(1, (w.dataPtr.value - w.minData) / (w.maxData - w.minData)));
        const fillW = Math.round(ratio * (pbW - 4));
        if (fillW > 0) OLED.drawRect(pbX + 2, pbY + 2, fillW, pbH - 4, true);
        const valStr = Number.isInteger(w.dataPtr.value) ? String(w.dataPtr.value) : w.dataPtr.value.toFixed(1);
        const valW = this.calcTextWidth(valStr, 8);
        this.showMixString(wx + ww - (w.sideDistance || 4) - valW, wy + (w.textTopDistance || 3), valStr, 8);
    }
};

// Input handling
UI.handleWindowInput = function() {
    if (!this.currentWindow || !this.windowFlag) return;
    const w = this.currentWindow;
    if (w.dataPtr !== undefined) {
        if (this.encoderDelta !== 0) { w.dataPtr.value += this.encoderDelta * w.dataStep; w.dataPtr.value = Math.max(w.minData, Math.min(w.maxData, w.dataPtr.value)); this.windowSustainCount = 0; }
        if (this.key.up === 0 && this.lastKey.up === 1) { w.dataPtr.value = Math.min(w.maxData, w.dataPtr.value + w.dataStep); this.windowSustainCount = 0; }
        if (this.key.down === 0 && this.lastKey.down === 1) { w.dataPtr.value = Math.max(w.minData, w.dataPtr.value - w.dataStep); this.windowSustainCount = 0; }
    }
    if ((this.key.back === 0 && this.lastKey.back === 1) || (this.key.enter === 0 && this.lastKey.enter === 1)) this.closeWindow();
};

UI.closeWindow = function() { this.windowFlag = false; this.currentWindow = null; this.windowAnim.w.target = 0; this.windowAnim.h.target = 0; };

UI.createWindow = function(w) {
    this.currentWindow = w; this.windowFlag = true; this.windowSustainCount = 0;
    Animation.resetDistance(this.windowAnim.w, 0); Animation.resetDistance(this.windowAnim.h, 0);
    this.windowAnim.w.target = w.width; this.windowAnim.h.target = w.height;
};

// Menu navigation
UI.handleMenuInput = function(page) {
    if (!page) return;
    const count = this.getItemCount(page);
    if (count === 0) return;
    const isTiles = page.menuType >= this.MENU_TYPE_TILES;

    if (this.encoderDelta !== 0) {
        const oldID = page._activeMenuID;
        page._activeMenuID += this.encoderDelta > 0 ? 1 : -1;
        page._activeMenuID = Math.max(0, Math.min(count - 1, page._activeMenuID));
        if (page._activeMenuID !== oldID) {
            if (isTiles) this.movePageTiles(page, this.encoderDelta > 0 ? 1 : -1);
            else this.movePageList(page, this.encoderDelta > 0 ? 1 : -1);
        }
    }
    if (this.key.up === 0 && this.lastKey.up === 1 && page._activeMenuID > 0) {
        page._activeMenuID--;
        if (isTiles) this.movePageTiles(page, -1); else this.movePageList(page, -1);
    }
    if (this.key.down === 0 && this.lastKey.down === 1 && page._activeMenuID < count - 1) {
        page._activeMenuID++;
        if (isTiles) this.movePageTiles(page, 1); else this.movePageList(page, 1);
    }
    if (this.key.enter === 0 && this.lastKey.enter === 1) {
        const item = page.items[page._activeMenuID];
        if (item) {
            if (item.radioBox !== undefined) item.radioBox = !item.radioBox;
            else if (item.subMenuPage) this.enterPage(item.subMenuPage);
            else if (item.callback) item.callback();
        }
    }
    if (this.key.back === 0 && this.lastKey.back === 1 && page.parentPage) {
        this.enterPage(page.parentPage);
    }
};

UI.movePageList = function(page, dir) {
    const fontSize = page.fontSize || 12;
    const ls = this.lineStep.target;
    const area = page.menuArea || { x: 1, y: 1, w: 126, h: 62 };
    const maxSlot = Math.floor((area.h - (page.startPointY || 2) + ls - 1) / (ls + fontSize));
    if (dir > 0 && page._activeMenuID > (page._slot || 0) + maxSlot - 1) {
        page._slot = (page._slot || 0) + 1;
        this.pageStart.y.target -= (ls + fontSize);
    } else if (dir < 0 && page._activeMenuID < (page._slot || 0)) {
        page._slot = (page._slot || 0) - 1;
        this.pageStart.y.target += (ls + fontSize);
    }
};

UI.movePageTiles = function(page, dir) {
    const tileW = page.tileWidth || 32;
    if (dir > 0) this.pageStart.x.target -= (this.lineStep.target + tileW);
    else this.pageStart.x.target += (this.lineStep.target + tileW);
};

UI.enterPage = function(page) {
    this.currentPage = page;
    const fontSize = page.fontSize || 12;
    const isTiles = page.menuType >= this.MENU_TYPE_TILES;

    if (!page._ifInit) {
        page._activeMenuID = 0;
        page._slot = 0;
        page._ifInit = true;

        if (isTiles) {
            const screenW = page.screenWidth || 128;
            const tileW = page.tileWidth || 32;
            this.pageStart.x.target = screenW / 2 - tileW / 2;
            this.pageStart.x.current = -50;
            if (page.menuType === this.MENU_TYPE_TILES_DEPTH) this.pageStart.y.target = 6;
            else if (page.menuType === this.MENU_TYPE_TILES_HOPE || page.menuType === this.MENU_TYPE_TILES_ARC) this.pageStart.y.target = 0;
            else this.pageStart.y.target = this.TILES_STARTPOINT_Y;
            this.pageStart.y.current = -tileW;
            this.lineStep.current = 1;
            this.lineStep.target = page.lineSpace || 8;
        } else {
            const area = page.menuArea || { x: 1, y: 1, w: 126, h: 62 };
            this.pageStart.x.target = area.x + (page.startPointX || 4);
            this.pageStart.x.current = this.pageStart.x.target + 128;
            this.pageStart.y.target = area.y + (page.startPointY || 2);
            this.pageStart.y.current = this.pageStart.y.target;
            this.lineStep.current = -3;
            this.lineStep.target = page.lineSpace || 4;
            this.menuFrame.x.target = area.x; this.menuFrame.y.target = area.y;
            this.menuFrame.w.target = area.w; this.menuFrame.h.target = area.h;
            Animation.resetDistance(this.menuFrame.x, area.x);
            Animation.resetDistance(this.menuFrame.y, area.y);
            Animation.resetDistance(this.menuFrame.w, area.w);
            Animation.resetDistance(this.menuFrame.h, area.h);
        }
    } else {
        if (isTiles) {
            const screenW = page.screenWidth || 128;
            const tileW = page.tileWidth || 32;
            this.pageStart.x.target = screenW / 2 - tileW / 2 - page._activeMenuID * (tileW + (page.lineSpace || 8));
            if (page.menuType === this.MENU_TYPE_TILES_DEPTH) this.pageStart.y.target = 6;
            else if (page.menuType === this.MENU_TYPE_TILES_HOPE || page.menuType === this.MENU_TYPE_TILES_ARC) this.pageStart.y.target = 0;
            else this.pageStart.y.target = this.TILES_STARTPOINT_Y;
            this.pageStart.x.current = this.pageStart.x.target + tileW;
            this.pageStart.y.current = -tileW - 1;
            this.lineStep.current = page.lineSpace || 8;
            this.lineStep.target = page.lineSpace || 8;
        } else {
            const area = page.menuArea || { x: 1, y: 1, w: 126, h: 62 };
            this.pageStart.x.target = area.x + (page.startPointX || 4);
            this.pageStart.x.current = this.pageStart.x.target - 128;
            const slot = page._slot || 0;
            this.pageStart.y.target = area.y + (page.startPointY || 2) - slot * (fontSize + (page.lineSpace || 4));
            this.pageStart.y.current = this.pageStart.y.target;
            this.lineStep.current = page.lineSpace || 4;
            this.lineStep.target = page.lineSpace || 4;
            this.menuFrame.x.target = area.x; this.menuFrame.y.target = area.y;
            this.menuFrame.w.target = area.w; this.menuFrame.h.target = area.h;
            Animation.resetDistance(this.menuFrame.x, area.x);
            Animation.resetDistance(this.menuFrame.y, area.y);
            Animation.resetDistance(this.menuFrame.w, area.w);
            Animation.resetDistance(this.menuFrame.h, area.h);
        }
    }
};

UI.goBack = function() { if (this.currentPage && this.currentPage.parentPage) this.enterPage(this.currentPage.parentPage); };

// Main loop
UI.init = function(page) {
    this.initState();
    this.currentPage = page;
    if (page) {
        page._activeMenuID = 0;
        page._slot = 0;
        page._ifInit = false;
        this.enterPage(page);
    }
};

UI.setTargets = function() {
    if (!this.currentPage) return;
    const page = this.currentPage;
    const count = this.getItemCount(page);
    const fontSize = page.fontSize || 12;
    const activeID = page._activeMenuID || 0;
    const asciiW = this.getASCIIWidth(fontSize);

    if (page.menuType === this.MENU_TYPE_LIST) {
        const area = page.menuArea || { x: 1, y: 1, w: 126, h: 62 };
        this.scrollBarH.target = count > 0 ? area.h * (activeID + 1) / count : 0;
        let lpW = page.drawLinePrefix ? asciiW + this.LINEPERFIX_DISTANCE : 0;
        this.cursor.x.target = this.pageStart.x.target - 1;
        this.cursor.y.target = this.pageStart.y.target + activeID * ((page.lineSpace || 4) + fontSize) - 1;
        this.cursor.h.target = fontSize + 2;
        const item = page.items[activeID];
        const strW = item ? this.calcTextWidth(item.text, fontSize) : 0;
        this.cursor.w.target = Math.min(strW + 2 + lpW, area.w - 6);
    } else {
        const screenW = page.screenWidth || 128;
        this.scrollBarH.target = count > 0 ? screenW * (activeID + 1) / count : 0;
    }
};

UI.mainLoop = function() {
    if (!this.currentPage) return;
    if (this.windowFlag) this.handleWindowInput();
    else this.handleMenuInput(this.currentPage);

    OLED.clear();
    const speed = this.currentPage.movingSpeed || 10;
    const mode = this.currentPage.moveStyle || 0;

    this.setTargets();
    Animation.animatePoint(this.pageStart, speed, mode);
    Animation.animateDistance(this.lineStep, speed, mode);
    Animation.animateDistance(this.scrollBarH, speed, mode);
    Animation.animateArea(this.menuFrame, speed, mode);

    switch (this.currentPage.menuType) {
        case this.MENU_TYPE_LIST: this.renderList(this.currentPage); break;
        case this.MENU_TYPE_TILES: this.renderTiles(this.currentPage); break;
        case this.MENU_TYPE_TILES_DEPTH: this.renderTilesDepth(this.currentPage); break;
        case this.MENU_TYPE_TILES_HOPE: this.renderTilesHope(this.currentPage); break;
        case this.MENU_TYPE_TILES_ARC: this.renderTilesArc(this.currentPage); break;
        default: this.renderList(this.currentPage); break;
    }

    if (this.currentPage.menuType === this.MENU_TYPE_LIST && this.currentPage.cursorStyle !== this.NOT_SHOW) {
        Animation.animateArea(this.cursor, speed, mode);
        this.reverseCoordinate(this.cursor.x.current, this.cursor.y.current, this.cursor.w.current, this.cursor.h.current, this.currentPage.cursorStyle);
    }

    if (this.windowFlag) {
        Animation.animateArea(this.windowAnim, speed, mode);
        this.renderWindow();
        this.windowSustainCount++;
        if (this.currentWindow && this.windowSustainCount > (this.currentWindow.continueTime || 4) * 50) this.closeWindow();
    }

    this.fps.count++;
    if (this.showFps) { const s = String(this.fps.value); this.showMixString(128 - this.calcTextWidth(s, 8), 0, s, 8); }
};

UI.interruptHandler = function() { this.fps.step++; if (this.fps.step >= 10) { this.fps.step = 0; this.fps.value = this.fps.count; this.fps.count = 0; } };

UI.setInput = function(k, enc) { this.lastKey = {...this.key}; this.key = {...k}; this.encoderDelta = enc || 0; };

UI.getCurrentPage = function() { return this.currentPage; };
UI.setShowFps = function(v) { this.showFps = v; };
