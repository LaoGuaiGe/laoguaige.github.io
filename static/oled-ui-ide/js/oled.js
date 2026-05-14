const OLED = (() => {
    const WIDTH = 128;
    const HEIGHT = 64;
    const PAGES = 8;
    const buf = new Uint8Array(PAGES * WIDTH);

    function clear() { buf.fill(0); }

    function clearArea(x, y, w, h) {
        for (let j = y; j < y + h; j++) {
            if (j < 0 || j >= HEIGHT) continue;
            for (let i = x; i < x + w; i++) {
                if (i < 0 || i >= WIDTH) continue;
                buf[(j >> 3) * WIDTH + i] &= ~(1 << (j & 7));
            }
        }
    }

    function drawPoint(x, y) {
        x = Math.round(x); y = Math.round(y);
        if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return;
        buf[(y >> 3) * WIDTH + x] |= (1 << (y & 7));
    }

    function getPoint(x, y) {
        x = Math.round(x); y = Math.round(y);
        if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return 0;
        return (buf[(y >> 3) * WIDTH + x] >> (y & 7)) & 1;
    }

    function drawLine(x0, y0, x1, y1) {
        x0 = Math.round(x0); y0 = Math.round(y0);
        x1 = Math.round(x1); y1 = Math.round(y1);
        const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        while (true) {
            drawPoint(x0, y0);
            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
        }
    }

    function drawRect(x, y, w, h, filled) {
        x = Math.round(x); y = Math.round(y);
        w = Math.round(w); h = Math.round(h);
        if (filled) {
            for (let j = y; j < y + h; j++) {
                if (j < 0 || j >= HEIGHT) continue;
                for (let i = x; i < x + w; i++) {
                    if (i < 0 || i >= WIDTH) continue;
                    buf[(j >> 3) * WIDTH + i] |= (1 << (j & 7));
                }
            }
        } else {
            drawLine(x, y, x + w - 1, y);
            drawLine(x, y + h - 1, x + w - 1, y + h - 1);
            drawLine(x, y, x, y + h - 1);
            drawLine(x + w - 1, y, x + w - 1, y + h - 1);
        }
    }

    function drawRoundedRect(x, y, w, h, r, filled) {
        x = Math.round(x); y = Math.round(y);
        w = Math.round(w); h = Math.round(h);
        r = Math.round(r);
        if (r <= 0) { drawRect(x, y, w, h, filled); return; }
        if (filled) {
            drawRect(x + r, y, w - 2 * r, h, true);
            drawRect(x, y + r, r, h - 2 * r, true);
            drawRect(x + w - r, y + r, r, h - 2 * r, true);
            fillCircleCorners(x + r, y + r, r, 1);
            fillCircleCorners(x + w - r - 1, y + r, r, 2);
            fillCircleCorners(x + r, y + h - r - 1, r, 4);
            fillCircleCorners(x + w - r - 1, y + h - r - 1, r, 8);
        } else {
            drawLine(x + r, y, x + w - r - 1, y);
            drawLine(x + r, y + h - 1, x + w - r - 1, y + h - 1);
            drawLine(x, y + r, x, y + h - r - 1);
            drawLine(x + w - 1, y + r, x + w - 1, y + h - r - 1);
            drawArcCorner(x + r, y + r, r, 1);
            drawArcCorner(x + w - r - 1, y + r, r, 2);
            drawArcCorner(x + r, y + h - r - 1, r, 4);
            drawArcCorner(x + w - r - 1, y + h - r - 1, r, 8);
        }
    }

    function drawArcCorner(cx, cy, r, corner) {
        let x = 0, y = r, d = 3 - 2 * r;
        while (x <= y) {
            if (corner & 1) { drawPoint(cx - y, cy - x); drawPoint(cx - x, cy - y); }
            if (corner & 2) { drawPoint(cx + x, cy - y); drawPoint(cx + y, cy - x); }
            if (corner & 4) { drawPoint(cx - y, cy + x); drawPoint(cx - x, cy + y); }
            if (corner & 8) { drawPoint(cx + x, cy + y); drawPoint(cx + y, cy + x); }
            if (d < 0) { d += 4 * x + 6; }
            else { d += 4 * (x - y) + 10; y--; }
            x++;
        }
    }

    function fillCircleCorners(cx, cy, r, corner) {
        let x = 0, y = r, d = 3 - 2 * r;
        while (x <= y) {
            if (corner & 1) { for (let i = cx - y; i <= cx; i++) drawPoint(i, cy - x); for (let i = cx - x; i <= cx; i++) drawPoint(i, cy - y); }
            if (corner & 2) { for (let i = cx; i <= cx + y; i++) drawPoint(i, cy - x); for (let i = cx; i <= cx + x; i++) drawPoint(i, cy - y); }
            if (corner & 4) { for (let i = cx - y; i <= cx; i++) drawPoint(i, cy + x); for (let i = cx - x; i <= cx; i++) drawPoint(i, cy + y); }
            if (corner & 8) { for (let i = cx; i <= cx + y; i++) drawPoint(i, cy + x); for (let i = cx; i <= cx + x; i++) drawPoint(i, cy + y); }
            if (d < 0) { d += 4 * x + 6; }
            else { d += 4 * (x - y) + 10; y--; }
            x++;
        }
    }

    function drawCircle(cx, cy, r, filled) {
        cx = Math.round(cx); cy = Math.round(cy); r = Math.round(r);
        if (filled) {
            for (let y = -r; y <= r; y++) {
                for (let x = -r; x <= r; x++) {
                    if (x * x + y * y <= r * r) drawPoint(cx + x, cy + y);
                }
            }
        } else {
            let x = 0, y = r, d = 3 - 2 * r;
            while (x <= y) {
                drawPoint(cx + x, cy + y); drawPoint(cx - x, cy + y);
                drawPoint(cx + x, cy - y); drawPoint(cx - x, cy - y);
                drawPoint(cx + y, cy + x); drawPoint(cx - y, cy + x);
                drawPoint(cx + y, cy - x); drawPoint(cx - y, cy - x);
                if (d < 0) { d += 4 * x + 6; }
                else { d += 4 * (x - y) + 10; y--; }
                x++;
            }
        }
    }

    function reverseArea(x, y, w, h) {
        x = Math.round(x); y = Math.round(y);
        w = Math.round(w); h = Math.round(h);
        for (let j = y; j < y + h; j++) {
            if (j < 0 || j >= HEIGHT) continue;
            for (let i = x; i < x + w; i++) {
                if (i < 0 || i >= WIDTH) continue;
                buf[(j >> 3) * WIDTH + i] ^= (1 << (j & 7));
            }
        }
    }

    function showImage(x, y, w, h, data) {
        if (!data) return;
        x = Math.round(x); y = Math.round(y);
        const pages = Math.ceil(h / 8);
        for (let p = 0; p < pages; p++) {
            for (let i = 0; i < w; i++) {
                const cx = x + i;
                const cy = y + p * 8;
                if (cx < 0 || cx >= WIDTH) continue;
                const byte = data[p * w + i];
                if (!byte) continue;
                const page = cy >> 3;
                const bit = cy & 7;
                if (page >= 0 && page < PAGES) {
                    buf[page * WIDTH + cx] |= (byte << bit) & 0xFF;
                }
                if (bit > 0 && page + 1 < PAGES) {
                    buf[(page + 1) * WIDTH + cx] |= (byte >> (8 - bit)) & 0xFF;
                }
            }
        }
    }

    function showImageArea(picX, picY, picW, picH, areaX, areaY, areaW, areaH, data) {
        if (!data) return;
        const pages = Math.ceil(picH / 8);
        for (let p = 0; p < pages; p++) {
            for (let i = 0; i < picW; i++) {
                const byte = data[p * picW + i];
                for (let bit = 0; bit < 8; bit++) {
                    if (!(byte & (1 << bit))) continue;
                    const px = picX + i;
                    const py = picY + p * 8 + bit;
                    if (px < areaX || px >= areaX + areaW) continue;
                    if (py < areaY || py >= areaY + areaH) continue;
                    drawPoint(px, py);
                }
            }
        }
    }

    function showChar(x, y, ch, fontWidth) {
        const font = Fonts.getFont(fontWidth);
        if (!font) return;
        const idx = ch.charCodeAt(0) - 32;
        if (idx < 0 || idx >= font.chars.length) return;
        showImage(x, y, font.dataWidth, font.dataHeight, font.chars[idx]);
    }

    function showString(x, y, str, fontWidth) {
        const font = Fonts.getFont(fontWidth);
        if (!font) return;
        for (let i = 0; i < str.length; i++) {
            showChar(x + i * font.width, y, str[i], fontWidth);
        }
    }

    function calcStringWidth(str, fontWidth) {
        const font = Fonts.getFont(fontWidth);
        if (!font) return 0;
        return str.length * font.width;
    }

    function printf(x, y, fontSize, fmt, ...args) {
        let str = fmt;
        let argIdx = 0;
        str = str.replace(/%d|%i|%f|%s|%.?\d*[difs]/g, (match) => {
            if (argIdx >= args.length) return match;
            return String(args[argIdx++]);
        });
        showString(x, y, str, fontSize);
    }

    function renderToCanvas(ctx, scale, colorOn, colorOff) {
        scale = scale || 4;
        colorOn = colorOn || [0, 180, 255];
        colorOff = colorOff || [0, 0, 0];
        const imgData = ctx.createImageData(WIDTH * scale, HEIGHT * scale);
        const d = imgData.data;
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const on = (buf[(y >> 3) * WIDTH + x] >> (y & 7)) & 1;
                const c = on ? colorOn : colorOff;
                for (let sy = 0; sy < scale; sy++) {
                    for (let sx = 0; sx < scale; sx++) {
                        const idx = ((y * scale + sy) * WIDTH * scale + (x * scale + sx)) * 4;
                        d[idx] = c[0]; d[idx + 1] = c[1]; d[idx + 2] = c[2]; d[idx + 3] = 255;
                    }
                }
            }
        }
        ctx.putImageData(imgData, 0, 0);
    }

    return {
        WIDTH, HEIGHT, buf, clear, clearArea,
        drawPoint, getPoint, drawLine, drawRect, drawRoundedRect,
        drawCircle, reverseArea,
        showImage, showImageArea, showChar, showString, calcStringWidth, printf,
        renderToCanvas
    };
})();
