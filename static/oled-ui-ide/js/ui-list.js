UI.renderList = function(page) {
    const items = page.items;
    const count = this.getItemCount(page);
    if (count === 0) return;

    const fontSize = page.fontSize || 12;
    const asciiW = this.getASCIIWidth(fontSize);
    const activeID = page._activeMenuID || 0;

    const fX = Math.round(this.menuFrame.x.current);
    const fY = Math.round(this.menuFrame.y.current);
    const fW = Math.round(this.menuFrame.w.current);
    const fH = Math.round(this.menuFrame.h.current);

    if (page.drawFrame) {
        OLED.drawRect(fX - 1, fY - 1, fW + 2, fH + 2, false);
    }

    let linePrefixW = 0;
    if (page.drawLinePrefix) {
        linePrefixW = asciiW + this.LINEPERFIX_DISTANCE;
    }

    let cpX = this.pageStart.x.current;
    let cpY = this.pageStart.y.current;

    for (let i = 0; i < count; i++) {
        if (cpY + fontSize < 0 || cpY > 64) {
            cpY += fontSize + this.lineStep.current;
            continue;
        }

        const item = items[i];
        const strLen = this.calcTextWidth(item.text, fontSize);

        // Draw line prefix
        if (page.drawLinePrefix && cpY >= fY && cpY < fY + fH) {
            let prefix = '-';
            if (item.subMenuPage) prefix = '>';
            else if (item.callback) prefix = '~';
            else if (item.radioBox !== undefined) prefix = '*';
            OLED.showChar(Math.round(cpX), Math.round(cpY), prefix, asciiW);
        }

        // Radio box compensation width
        let radioW = 0;
        if (item.radioBox !== undefined) {
            radioW = fontSize - 4 + 2;
        }

        // Text area clipping
        const textAreaX = fX + linePrefixW + (page.startPointX || 4);
        const textAreaW = fW - 6 - linePrefixW - (page.startPointX || 4) - 2 - radioW;

        // Marquee for long text on active item
        if (i === activeID && strLen > textAreaW) {
            item._lineSlip = (item._lineSlip || 0) - 0.5;
            if (item._lineSlip < -strLen) {
                item._lineSlip = textAreaW;
            }
        } else if (i !== activeID) {
            item._lineSlip = 0;
        }

        this.showMixStringArea(textAreaX, fY, textAreaW, fH,
            cpX + linePrefixW + (item._lineSlip || 0), cpY,
            item.text, fontSize);

        // Draw radio box
        if (item.radioBox !== undefined && cpY >= fY && cpY < fY + fH) {
            const rbSize = fontSize - 4;
            const rbX = Math.round(cpX + fW - radioW - 9);
            const rbY = Math.round(cpY + (fontSize - rbSize) / 2);
            OLED.drawRect(rbX, rbY, rbSize, rbSize, !!item.radioBox);
        }

        cpY += fontSize + this.lineStep.current;
    }

    // Scrollbar
    const sbH = Math.round(this.scrollBarH.current);
    const clampedSbH = Math.min(sbH, fH);
    if (clampedSbH > 0) {
        OLED.drawRect(fX + fW - 5, fY, 5, clampedSbH, true);
    }
    OLED.drawLine(fX + fW - 3, fY, fX + fW - 3, fY + fH - 1);
};
