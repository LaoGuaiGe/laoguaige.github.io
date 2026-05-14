const CodeGen = (() => {
    function generate(project) {
        let code = '';
        code += '#include "OLED_UI.h"\n';
        code += '#include "OLED_UI_MenuData.h"\n\n';

        // Forward declarations
        code += '// Forward declarations\n';
        for (const page of project.pages) {
            const name = safeName(page.name);
            code += `extern MenuItem ${name}Items[];\n`;
            code += `extern MenuPage ${name}Page;\n`;
        }
        code += '\n';

        // Menu items
        for (const page of project.pages) {
            const name = safeName(page.name);
            code += `MenuItem ${name}Items[] = {\n`;
            for (const item of page.items) {
                code += '    {';
                code += `.General_item_text = "${escC(item.text || '')}"`;
                if (item.callbackType === 'back') {
                    code += ', .General_callback = OLED_UI_Back';
                } else if (item.callbackType === 'window') {
                    code += `, .General_callback = ${safeName(item.text || 'Null')}Window`;
                } else {
                    code += ', .General_callback = NULL';
                }
                if (item.subMenuPageId) {
                    const sub = project.pages.find(p => p.id === item.subMenuPageId);
                    code += `, .General_SubMenuPage = &${safeName(sub ? sub.name : 'NULL')}Page`;
                } else {
                    code += ', .General_SubMenuPage = NULL';
                }
                if (item.radioBox !== undefined) {
                    code += `, .List_BoolRadioBox = &${safeName(item.text || 'var')}_bool`;
                }
                code += '},\n';
            }
            code += '    {.General_item_text = NULL},\n';
            code += '};\n\n';
        }

        // Menu pages
        for (const page of project.pages) {
            const name = safeName(page.name);
            const parent = page.parentPageId ? project.pages.find(p => p.id === page.parentPageId) : null;
            code += `MenuPage ${name}Page = {\n`;
            code += `    .General_MenuType = ${menuTypeStr(page.menuType)},\n`;
            code += `    .General_CursorStyle = ${cursorStyleStr(page.cursorStyle)},\n`;
            code += `    .General_FontSize = OLED_UI_FONT_${page.fontSize},\n`;
            code += `    .General_ParentMenuPage = ${parent ? '&' + safeName(parent.name) + 'Page' : 'NULL'},\n`;
            code += `    .General_LineSpace = ${page.lineSpace},\n`;
            code += `    .General_MoveStyle = ${page.moveStyle === 1 ? 'PID_CURVE' : 'UNLINEAR'},\n`;
            code += `    .General_MovingSpeed = ${page.movingSpeed},\n`;
            code += `    .General_ShowAuxiliaryFunction = NULL,\n`;
            code += `    .General_MenuItems = ${name}Items,\n`;

            if (page.menuType >= 1) {
                code += `    .Tiles_ScreenHeight = 64,\n`;
                code += `    .Tiles_ScreenWidth = 128,\n`;
                code += `    .Tiles_TileWidth = ${page.tileWidth},\n`;
                code += `    .Tiles_TileHeight = ${page.tileHeight},\n`;
            } else {
                const a = page.menuArea || { x: 1, y: 1, w: 126, h: 62 };
                code += `    .List_MenuArea = {${a.x}, ${a.y}, ${a.w}, ${a.h}},\n`;
                code += `    .List_IfDrawFrame = false,\n`;
                code += `    .List_IfDrawLinePerfix = ${page.drawLinePrefix ? 'true' : 'false'},\n`;
                code += `    .List_StartPointX = ${page.startPointX || 4},\n`;
                code += `    .List_StartPointY = ${page.startPointY || 2},\n`;
            }
            code += '};\n\n';
        }

        return code;
    }

    function safeName(s) {
        return s.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^[0-9]/, '_$&');
    }

    function escC(s) {
        return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    }

    function menuTypeStr(t) {
        const m = ['MENU_TYPE_LIST', 'MENU_TYPE_TILES', 'MENU_TYPE_TILES_DEPTH', 'MENU_TYPE_TILES_HOPE', 'MENU_TYPE_TILES_ARC'];
        return m[t] || 'MENU_TYPE_LIST';
    }

    function cursorStyleStr(c) {
        const s = ['REVERSE_RECTANGLE', 'REVERSE_ROUNDRECTANGLE', 'HOLLOW_RECTANGLE', 'HOLLOW_ROUNDRECTANGLE', 'REVERSE_BLOCK', 'NOT_SHOW'];
        return s[c] || 'REVERSE_ROUNDRECTANGLE';
    }

    return { generate };
})();
