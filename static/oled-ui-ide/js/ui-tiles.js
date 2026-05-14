UI.renderTiles = function(page) {
    const items = page.items;
    const count = this.getItemCount(page);
    if (count === 0) return;

    const fontSize = page.fontSize || 16;
    const tileW = page.tileWidth || 32;
    const tileH = page.tileHeight || 32;
    const activeID = page._activeMenuID || 0;
    const screenW = page.screenWidth || 128;
    const screenH = page.screenHeight || 64;

    let cpX = this.pageStart.x.current;
    let cpY = this.pageStart.y.current;

    for (let i = 0; i < count; i++) {
        if (cpX + tileW < 0 || cpX > 128) {
            cpX += tileW + this.lineStep.current;
            continue;
        }
        const drawX = Math.round(Math.ceil(cpX));
        const drawY = Math.round(cpY);
        if (items[i].icon) {
            OLED.showImageArea(drawX, drawY, tileW, tileH, 0, 0, screenW, screenH, items[i].icon);
        } else {
            OLED.drawRoundedRect(drawX + 2, drawY + 2, tileW - 4, tileH - 4, 3, false);
            const ch = items[i].text ? items[i].text[0] : '?';
            if (ch.charCodeAt(0) <= 127) OLED.showChar(drawX + (tileW - 8) / 2, drawY + (tileH - 16) / 2, ch, 8);
        }
        cpX += tileW + this.lineStep.current;
    }

    // Arrow indicator
    const arrowX = Math.round(screenW / 2 - 3);
    OLED.drawLine(arrowX + 3, 0, arrowX, 3);
    OLED.drawLine(arrowX + 3, 0, arrowX + 6, 3);

    // Bottom text
    const text = items[activeID] ? items[activeID].text : '';
    const strLen = this.calcTextWidth(text, fontSize);
    let textX;
    if (strLen > screenW) {
        items[activeID]._lineSlip = (items[activeID]._lineSlip || 0) - 0.5;
        if (items[activeID]._lineSlip < -strLen) items[activeID]._lineSlip = screenW + 1;
        textX = Math.round(items[activeID]._lineSlip || 0);
    } else {
        textX = Math.round(screenW / 2 - strLen / 2);
    }
    const textY = screenH - fontSize;
    this.showMixStringArea(0, 0, screenW, screenH, textX, textY, text, fontSize);

    // Scrollbar
    const sbBarH = 3;
    const sbW = Math.round(this.scrollBarH.current);
    OLED.drawRect(0, this.TILES_STARTPOINT_Y + tileH + this.TILES_SCROLLBAR_Y, sbW, sbBarH, true);
    OLED.drawLine(0, this.TILES_STARTPOINT_Y + tileH + this.TILES_SCROLLBAR_Y + 1,
                 screenW - 1, this.TILES_STARTPOINT_Y + tileH + this.TILES_SCROLLBAR_Y + 1);
};

UI.renderTilesDepth = function(page) {
    const items = page.items;
    const count = this.getItemCount(page);
    if (count === 0) return;

    const fontSize = page.fontSize || 16;
    const tileW = page.tileWidth || 32;
    const tileH = page.tileHeight || 32;
    const activeID = page._activeMenuID || 0;
    const screenW = page.screenWidth || 128;
    const screenH = page.screenHeight || 64;

    let cpX = this.pageStart.x.current;
    let cpY = this.pageStart.y.current;

    for (let i = 0; i < count; i++) {
        if (cpX + tileW < 0 || cpX > 128) {
            cpX += tileW + this.lineStep.current;
            continue;
        }
        const iconCenterX = Math.ceil(cpX) + tileW / 2;
        const depthDiff = iconCenterX - screenW / 2;
        const yOffset = Math.min(8, Math.abs(depthDiff) / 6);

        const iconX = Math.round(Math.ceil(cpX));
        const iconY = Math.round(cpY + yOffset);

        if (items[i].icon) {
            OLED.showImageArea(iconX, iconY, tileW, tileH, 0, 0, screenW, screenH, items[i].icon);
        } else {
            OLED.drawRoundedRect(iconX + 2, iconY + 2, tileW - 4, tileH - 4, 3, false);
            const ch = items[i].text ? items[i].text[0] : '?';
            if (ch.charCodeAt(0) <= 127) OLED.showChar(iconX + (tileW - 8) / 2, iconY + (tileH - 16) / 2, ch, 8);
        }

        // Round corners
        OLED.clearArea(iconX, iconY, 3, 1); OLED.clearArea(iconX, iconY + 1, 2, 1); OLED.clearArea(iconX, iconY + 2, 1, 1);
        OLED.clearArea(iconX + tileW - 3, iconY, 3, 1); OLED.clearArea(iconX + tileW - 2, iconY + 1, 2, 1); OLED.clearArea(iconX + tileW - 1, iconY + 2, 1, 1);
        OLED.clearArea(iconX, iconY + tileH - 1, 3, 1); OLED.clearArea(iconX, iconY + tileH - 2, 2, 1); OLED.clearArea(iconX, iconY + tileH - 3, 1, 1);
        OLED.clearArea(iconX + tileW - 3, iconY + tileH - 1, 3, 1); OLED.clearArea(iconX + tileW - 2, iconY + tileH - 2, 2, 1); OLED.clearArea(iconX + tileW - 1, iconY + tileH - 3, 1, 1);

        cpX += tileW + this.lineStep.current;
    }

    // Text bounce
    if (!page._textBounceY) page._textBounceY = 0;
    if (page._lastDepthID !== activeID) { page._textBounceY = 8; page._lastDepthID = activeID; }
    if (page._textBounceY > 0.3) page._textBounceY *= 0.75; else page._textBounceY = 0;

    // Hill ellipse
    const hillCY = screenH + 25 + Math.round(page._textBounceY);
    OLED.drawCircle(screenW / 2, hillCY, 45, true);

    // Text with reverse trick
    const text = items[activeID] ? items[activeID].text : '';
    const strLen = this.calcTextWidth(text, fontSize);
    const textY = screenH - fontSize - 2 + Math.round(page._textBounceY);
    const textX = strLen > screenW ? Math.round(items[activeID]._lineSlip || 0) : Math.round(screenW / 2 - strLen / 2);
    OLED.reverseArea(textX, textY, strLen, fontSize);
    this.showMixStringArea(0, 0, screenW, screenH, textX, textY, text, fontSize);
    OLED.reverseArea(textX, textY, strLen, fontSize);

    // Top dots
    const dotSpacing = 6;
    const dotsWidth = count * dotSpacing - 2;
    const dotStartX = Math.round((screenW - dotsWidth) / 2);
    for (let d = 0; d < count; d++) {
        const dx = dotStartX + d * dotSpacing;
        if (d === activeID) OLED.drawRect(dx, 1, 3, 3, true);
        else OLED.drawPoint(dx + 1, 2);
    }
};
