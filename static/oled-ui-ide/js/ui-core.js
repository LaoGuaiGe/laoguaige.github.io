const UI = {
    MENU_TYPE_LIST: 0,
    MENU_TYPE_TILES: 1,
    MENU_TYPE_TILES_DEPTH: 2,
    MENU_TYPE_TILES_HOPE: 3,
    MENU_TYPE_TILES_ARC: 4,
    REVERSE_RECTANGLE: 0,
    REVERSE_ROUNDRECTANGLE: 1,
    HOLLOW_RECTANGLE: 2,
    HOLLOW_ROUNDRECTANGLE: 3,
    REVERSE_BLOCK: 4,
    NOT_SHOW: 5,
    TILES_STARTPOINT_Y: 6,
    TILES_SCROLLBAR_Y: 4,
    LINEPERFIX_DISTANCE: 2,

    currentPage: null,
    currentWindow: null,
    windowFlag: false,
    windowSustainCount: 0,
    key: { enter: 1, back: 1, up: 1, down: 1 },
    lastKey: { enter: 1, back: 1, up: 1, down: 1 },
    encoderDelta: 0,
    fps: { count: 0, value: 0, step: 0 },
    showFps: false,

    cursor: null,
    pageStart: null,
    menuFrame: null,
    scrollBarH: null,
    lineStep: null,
    windowAnim: null,

    initState() {
        this.cursor = Animation.createArea(0, 0, 0, 0);
        this.pageStart = Animation.createPoint(0, 0);
        this.menuFrame = Animation.createArea(0, 0, 128, 64);
        this.scrollBarH = Animation.createDistance(0);
        this.lineStep = Animation.createDistance(4);
        this.windowAnim = Animation.createArea(0, 0, 0, 0);
    },

    getItemCount(page) {
        return (page && page.items) ? page.items.length : 0;
    },

    getASCIIWidth(fontSize) {
        switch (fontSize) {
            case 8: return 6; case 12: return 7; case 16: return 8; case 20: return 10;
            default: return 7;
        }
    },

    getChineseWidth(fontSize) { return fontSize; },

    calcTextWidth(text, fontSize) {
        if (!text) return 0;
        const aw = this.getASCIIWidth(fontSize), cw = this.getChineseWidth(fontSize);
        let w = 0;
        for (let i = 0; i < text.length; i++) w += (text.charCodeAt(i) > 127) ? cw : aw;
        return w;
    },

    showMixString(x, y, text, fontSize) {
        if (!text) return;
        const aw = this.getASCIIWidth(fontSize), cw = this.getChineseWidth(fontSize);
        let cx = x;
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            if (code > 127 && Fonts.hasChinese()) {
                const data = Fonts.getChineseCharData(code, fontSize);
                if (data) OLED.showImage(Math.round(cx), Math.round(y), cw, fontSize, data);
                cx += cw;
            } else if (code >= 32 && code <= 126) {
                OLED.showChar(Math.round(cx), Math.round(y), text[i], aw);
                cx += aw;
            } else { cx += aw; }
        }
    },

    showMixStringArea(areaX, areaY, areaW, areaH, x, y, text, fontSize) {
        if (!text) return;
        const aw = this.getASCIIWidth(fontSize), cw = this.getChineseWidth(fontSize);
        let cx = x;
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            const charW = (code > 127) ? cw : aw;
            // Only draw if character overlaps the clipping area
            if (cx + charW > areaX && cx < areaX + areaW && y >= areaY && y < areaY + areaH) {
                if (code > 127 && Fonts.hasChinese()) {
                    const data = Fonts.getChineseCharData(code, fontSize);
                    if (data) OLED.showImage(Math.round(cx), Math.round(y), cw, fontSize, data);
                } else if (code >= 32 && code <= 126) {
                    OLED.showChar(Math.round(cx), Math.round(y), text[i], aw);
                }
                // Pixel-level clip: clear pixels outside the area
                if (cx < areaX) {
                    OLED.clearArea(Math.round(cx), Math.round(y), Math.round(areaX - cx), fontSize);
                }
                if (cx + charW > areaX + areaW) {
                    OLED.clearArea(Math.round(areaX + areaW), Math.round(y), Math.round(cx + charW - areaX - areaW), fontSize);
                }
            }
            cx += charW;
        }
    },

    reverseCoordinate(x, y, w, h, style) {
        x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
        if (w <= 0 || h <= 0) return;
        switch (style) {
            case 0: OLED.reverseArea(x, y, w, h); break;
            case 1:
                OLED.reverseArea(x, y, w, h);
                if (w >= 3 && h >= 3) { OLED.reverseArea(x,y,1,1); OLED.reverseArea(x+w-1,y,1,1); OLED.reverseArea(x,y+h-1,1,1); OLED.reverseArea(x+w-1,y+h-1,1,1); }
                break;
            case 2:
                OLED.reverseArea(x, y, w, h);
                if (w > 2 && h > 2) OLED.reverseArea(x+1, y+1, w-2, h-2);
                break;
            case 3:
                OLED.reverseArea(x, y, w, h);
                if (w > 2 && h > 2) OLED.reverseArea(x+1, y+1, w-2, h-2);
                if (w >= 3) { OLED.reverseArea(x,y,1,1); OLED.reverseArea(x+w-1,y,1,1); }
                if (h >= 3) { OLED.reverseArea(x,y+h-1,1,1); OLED.reverseArea(x+w-1,y+h-1,1,1); }
                break;
            case 4: OLED.reverseArea(x, y+h-2, w, 2); break;
            case 5: break;
            default: OLED.reverseArea(x, y, w, h); break;
        }
    }
};
