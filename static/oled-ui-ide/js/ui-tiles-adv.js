UI.renderTilesHope = function(page) {
    const items = page.items;
    const count = this.getItemCount(page);
    if (count === 0) return;

    const fontSize = page.fontSize || 16;
    const tileW = page.tileWidth || 32;
    const tileH = page.tileHeight || 32;
    const activeID = page._activeMenuID || 0;
    const screenW = page.screenWidth || 128;
    const screenH = page.screenHeight || 64;

    if (!page._hopeRectW) page._hopeRectW = 0;
    if (!page._hopeTextBounceY) page._hopeTextBounceY = 0;
    if (!page._hopeFrameShake) page._hopeFrameShake = 0;

    const hopeFrameBase = screenW / 2 - tileW / 2;

    if (page._hopeLastID !== activeID) {
        page._hopeRectW = -4;
        page._hopeTextBounceY = 8;
        page._hopeFrameShake = (activeID > (page._hopeLastID || 0)) ? -10 : 10;
        page._hopeLastID = activeID;
    }

    page._hopeRectW += (13 - page._hopeRectW) * 0.1;
    if (Math.abs(page._hopeRectW - 13) < 0.5) page._hopeRectW = 13;
    if (page._hopeTextBounceY > 0.3) page._hopeTextBounceY *= 0.75;
    else page._hopeTextBounceY = 0;
    page._hopeFrameShake *= 0.92;
    if (Math.abs(page._hopeFrameShake) < 0.5) page._hopeFrameShake = 0;

    let cpX = this.pageStart.x.current;
    let cpY = this.pageStart.y.current;

    // Draw all icons normally
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

    // Selection frame: only reverse the selected icon
    const frameX = Math.round(hopeFrameBase + page._hopeFrameShake);
    const frameY = Math.round(this.pageStart.y.current);
    OLED.reverseArea(frameX, frameY, tileW, tileH);

    // Bottom reveal bar
    const barY = Math.round(screenH / 2 + 4);
    const barH = 24;
    if (Math.round(page._hopeRectW) > 0) {
        OLED.reverseArea(0, barY, Math.round(page._hopeRectW), barH);
    }

    // Title text
    const text = items[activeID] ? items[activeID].text : '';
    const strLen = this.calcTextWidth(text, fontSize);
    const titleX = Math.round((screenW - strLen) / 2);
    const titleY = Math.round(barY + (barH - fontSize) / 2 + page._hopeTextBounceY);
    this.showMixStringArea(0, 0, screenW, screenH, titleX, titleY, text, fontSize);
};

UI.renderTilesArc = function(page) {
    const items = page.items;
    const count = this.getItemCount(page);
    if (count === 0) return;

    const fontSize = page.fontSize || 16;
    const tileW = page.tileWidth || 32;
    const tileH = page.tileHeight || 32;
    const activeID = page._activeMenuID || 0;
    const screenW = page.screenWidth || 128;
    const screenH = page.screenHeight || 64;

    if (!page._arcIndicator) page._arcIndicator = 0;
    if (!page._arcUpX) page._arcUpX = 0;
    if (!page._arcUpY) page._arcUpY = 0;
    if (!page._arcTextLineW) page._arcTextLineW = 0;
    if (!page._arcBarH) page._arcBarH = 0;
    if (!page._arcDirection) page._arcDirection = 0;

    if (page._arcLastID !== activeID) {
        if (activeID > (page._arcLastID || 0)) { page._arcDirection = 1; page._arcIndicator = 20; }
        else { page._arcDirection = -1; page._arcIndicator = 30; }
        page._arcLastID = activeID;
        page._arcBarH = 0;
    }

    page._arcUpX = 0.04 * page._arcIndicator + 0.96 * page._arcUpX;
    page._arcUpY = 0.1 * page._arcIndicator + 0.9 * page._arcUpY;
    if (page._arcUpY > 15) page._arcIndicator = 0;
    if (Math.abs(page._arcIndicator - page._arcUpX) < 0.5) page._arcUpX = page._arcIndicator;
    if (Math.abs(page._arcIndicator - page._arcUpY) < 0.5) page._arcUpY = page._arcIndicator;

    let cpX = this.pageStart.x.current;
    let cpY = this.pageStart.y.current;

    // Draw icons with arc perspective: X compressed to half + offset, Y follows arc
    for (let i = 0; i < count; i++) {
        if (cpX + tileW < 0 || cpX > 128) {
            cpX += tileW + this.lineStep.current;
            continue;
        }
        const rawX = Math.round(Math.ceil(cpX));
        const drawX = Math.round(rawX / 2 + 60);
        const drawY = Math.round(cpY + rawX - 33);

        if (items[i].icon) {
            OLED.showImageArea(drawX, drawY, tileW, tileH, 0, 0, screenW, screenH, items[i].icon);
        } else {
            OLED.drawRoundedRect(drawX, drawY, tileW, tileH, 3, false);
            const ch = items[i].text ? items[i].text[0] : '?';
            if (ch.charCodeAt(0) <= 127) OLED.showChar(drawX + (tileW - 8) / 2, drawY + (tileH - 16) / 2, ch, 8);
        }
        cpX += tileW + this.lineStep.current;
    }

    // HUD bracket frame
    const bx = Math.round(page._arcUpX * page._arcDirection) + 81;
    const by = Math.round(page._arcUpY * page._arcDirection) + 12;
    const bw = tileW + 6;
    const bh = tileH + 6;

    OLED.drawLine(bx, by, bx + 10, by); OLED.drawLine(bx, by + 1, bx + 10, by + 1);
    OLED.drawLine(bx, by, bx, by + 6); OLED.drawLine(bx + 1, by, bx + 1, by + 6);
    OLED.drawRect(bx + 12, by, 2, 2, true);

    OLED.drawLine(bx + bw, by + bh - 1, bx + bw - 10, by + bh - 1); OLED.drawLine(bx + bw, by + bh - 2, bx + bw - 10, by + bh - 2);
    OLED.drawLine(bx + bw, by + bh - 1, bx + bw, by + bh - 7); OLED.drawLine(bx + bw - 1, by + bh - 1, bx + bw - 1, by + bh - 7);
    OLED.drawRect(bx + bw - 13, by + bh - 2, 2, 2, true);

    OLED.drawLine(bx, by + bh / 2 - 2, bx, by + bh / 2 + 2); OLED.drawLine(bx + 1, by + bh / 2 - 2, bx + 1, by + bh / 2 + 2);
    OLED.drawLine(bx + bw, by + bh / 2 - 2, bx + bw, by + bh / 2 + 2); OLED.drawLine(bx + bw - 1, by + bh / 2 - 2, bx + bw - 1, by + bh / 2 + 2);

    // Bottom text + rounded bar
    const text = items[activeID] ? items[activeID].text : '';
    const strLen = this.calcTextWidth(text, fontSize);

    if (strLen > screenW) {
        items[activeID]._lineSlip = (items[activeID]._lineSlip || 0) - 0.5;
        if (items[activeID]._lineSlip < -strLen) items[activeID]._lineSlip = screenW + 1;
    }

    const textBaseX = strLen > screenW ?
        Math.round(items[activeID]._lineSlip || 0) :
        Math.round(screenW / 2 - strLen / 2);

    const textX = Math.round(page._arcUpY) - 6 + textBaseX - 20;
    const textY = 34 + Math.round(page._arcUpY * 1.5);

    const arcBarH_trg = 64 - textY - fontSize;
    page._arcBarH += (arcBarH_trg - page._arcBarH) * 0.12;
    if (Math.abs(page._arcBarH - arcBarH_trg) < 0.5) page._arcBarH = arcBarH_trg;

    page._arcTextLineW = 0.1 * strLen + 0.9 * page._arcTextLineW;
    const barW = Math.round(page._arcTextLineW) + 10;
    const barH = Math.round(page._arcBarH);
    const barX = textX - 5;
    const barY = 64 - barH;

    if (barW > 0 && barH > 0) {
        OLED.reverseArea(barX, barY, barW, barH);
        OLED.reverseArea(barX, barY, 3, 1);
        OLED.reverseArea(barX, barY + 1, 1, 1);
        OLED.reverseArea(barX + barW - 3, barY, 3, 1);
        OLED.reverseArea(barX + barW - 1, barY + 1, 1, 1);
    }

    this.showMixStringArea(0, 0, screenW, screenH, textX, textY, text, fontSize);
};
