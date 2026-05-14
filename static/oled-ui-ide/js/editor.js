const Editor = (() => {
    let selectedPageId = null;
    let selectedItemIdx = -1;

    function init() {
        renderTree();
        renderProperties();
        setupToolbar();
    }

    function refreshUI() {
        document.getElementById('btn-new-page').textContent = I18n.t('newPage');
        document.getElementById('btn-add-item').textContent = I18n.t('addItem');
        document.getElementById('btn-import-json').textContent = I18n.t('importJson');
        document.getElementById('btn-export-json').textContent = I18n.t('exportJson');
        document.getElementById('btn-export-c').textContent = I18n.t('exportC');
        document.getElementById('tree-title').textContent = I18n.t('treeTitle');
        document.getElementById('hint-text').textContent = I18n.t('hint');
        document.getElementById('code-panel-title').textContent = I18n.t('codeTitle');
        document.getElementById('btn-copy-code').textContent = I18n.t('copy');
        document.getElementById('btn-close-code').textContent = I18n.t('close');
        renderTree();
        renderProperties();
    }

    function renderTree() {
        const tree = document.getElementById('menu-tree');
        if (!tree) return;
        const project = App.getProject();
        let html = '';
        for (const page of project.pages) {
            const isRoot = page.id === project.rootPageId;
            const sel = page.id === selectedPageId ? ' selected' : '';
            html += `<div class="tree-page${sel}" data-id="${page.id}">`;
            html += `<div class="tree-page-header" onclick="Editor.selectPage('${page.id}')">`;
            html += `<span class="tree-icon">${isRoot ? '★' : '◆'}</span> ${escHtml(page.name)}`;
            html += `</div>`;
            html += `<div class="tree-items">`;
            for (let i = 0; i < page.items.length; i++) {
                const item = page.items[i];
                const isel = (page.id === selectedPageId && i === selectedItemIdx) ? ' selected' : '';
                html += `<div class="tree-item${isel}" onclick="Editor.selectItem('${page.id}',${i})">`;
                html += `  ${escHtml(item.text || I18n.t('empty'))}`;
                html += `</div>`;
            }
            html += `</div></div>`;
        }
        tree.innerHTML = html;
    }

    function renderProperties() {
        const panel = document.getElementById('props-panel');
        if (!panel) return;
        const project = App.getProject();

        if (selectedPageId && selectedItemIdx >= 0) {
            const page = project.pages.find(p => p.id === selectedPageId);
            if (!page || !page.items[selectedItemIdx]) { panel.innerHTML = ''; return; }
            const item = page.items[selectedItemIdx];
            panel.innerHTML = renderItemProps(item, page);
        } else if (selectedPageId) {
            const page = project.pages.find(p => p.id === selectedPageId);
            if (!page) { panel.innerHTML = ''; return; }
            panel.innerHTML = renderPageProps(page);
        } else {
            panel.innerHTML = `<p class="hint">${I18n.t('propsHint')}</p>`;
        }
    }

    function renderPageProps(page) {
        const project = App.getProject();
        const parentOpts = project.pages
            .filter(p => p.id !== page.id)
            .map(p => `<option value="${p.id}" ${p.id === page.parentPageId ? 'selected' : ''}>${escHtml(p.name)}</option>`)
            .join('');

        return `
        <h3>${I18n.t('pagePrefix')}: ${escHtml(page.name)}</h3>
        <label>${I18n.t('pageName')}<input type="text" value="${escHtml(page.name)}" onchange="Editor.updatePage('name',this.value)"></label>
        <label>${I18n.t('menuType')}
            <select onchange="Editor.updatePage('menuType',+this.value)">
                <option value="0" ${page.menuType===0?'selected':''}>${I18n.t('typeList')}</option>
                <option value="1" ${page.menuType===1?'selected':''}>${I18n.t('typeTiles')}</option>
                <option value="2" ${page.menuType===2?'selected':''}>${I18n.t('typeTilesDepth')}</option>
                <option value="3" ${page.menuType===3?'selected':''}>${I18n.t('typeTilesHope')}</option>
                <option value="4" ${page.menuType===4?'selected':''}>${I18n.t('typeTilesArc')}</option>
            </select>
        </label>
        <label>${I18n.t('fontSize')}
            <select onchange="Editor.updatePage('fontSize',+this.value)">
                <option value="8" ${page.fontSize===8?'selected':''}>8px</option>
                <option value="12" ${page.fontSize===12?'selected':''}>12px</option>
                <option value="16" ${page.fontSize===16?'selected':''}>16px</option>
                <option value="20" ${page.fontSize===20?'selected':''}>20px</option>
            </select>
        </label>
        <label>${I18n.t('cursorStyle')}
            <select onchange="Editor.updatePage('cursorStyle',+this.value)">
                <option value="0" ${page.cursorStyle===0?'selected':''}>${I18n.t('cursorReverseRect')}</option>
                <option value="1" ${page.cursorStyle===1?'selected':''}>${I18n.t('cursorReverseRound')}</option>
                <option value="2" ${page.cursorStyle===2?'selected':''}>${I18n.t('cursorHollowRect')}</option>
                <option value="3" ${page.cursorStyle===3?'selected':''}>${I18n.t('cursorHollowRound')}</option>
                <option value="4" ${page.cursorStyle===4?'selected':''}>${I18n.t('cursorUnderline')}</option>
                <option value="5" ${page.cursorStyle===5?'selected':''}>${I18n.t('cursorHidden')}</option>
            </select>
        </label>
        <label>${I18n.t('lineSpace')}<input type="number" value="${page.lineSpace}" min="0" max="20" onchange="Editor.updatePage('lineSpace',+this.value)"></label>
        <label>${I18n.t('moveSpeed')}<input type="range" value="${page.movingSpeed}" min="1" max="30" onchange="Editor.updatePage('movingSpeed',+this.value)"><span>${page.movingSpeed}</span></label>
        <label>${I18n.t('animation')}
            <select onchange="Editor.updatePage('moveStyle',+this.value)">
                <option value="0" ${page.moveStyle===0?'selected':''}>${I18n.t('animNonlinear')}</option>
                <option value="1" ${page.moveStyle===1?'selected':''}>${I18n.t('animPID')}</option>
            </select>
        </label>
        <label>${I18n.t('parentPage')}
            <select onchange="Editor.updatePage('parentPageId',this.value||null)">
                <option value="">${I18n.t('noneParent')}</option>
                ${parentOpts}
            </select>
        </label>
        <label>${I18n.t('drawPrefix')}<input type="checkbox" ${page.drawLinePrefix?'checked':''} onchange="Editor.updatePage('drawLinePrefix',this.checked)"></label>
        ${page.menuType >= 1 ? `
        <label>${I18n.t('tileWidth')}<input type="number" value="${page.tileWidth}" min="8" max="64" onchange="Editor.updatePage('tileWidth',+this.value)"></label>
        <label>${I18n.t('tileHeight')}<input type="number" value="${page.tileHeight}" min="8" max="64" onchange="Editor.updatePage('tileHeight',+this.value)"></label>
        ` : `
        <label>${I18n.t('areaX')}<input type="number" value="${page.menuArea.x}" min="0" max="127" onchange="Editor.updatePageArea('x',+this.value)"></label>
        <label>${I18n.t('areaY')}<input type="number" value="${page.menuArea.y}" min="0" max="63" onchange="Editor.updatePageArea('y',+this.value)"></label>
        <label>${I18n.t('areaW')}<input type="number" value="${page.menuArea.w}" min="1" max="128" onchange="Editor.updatePageArea('w',+this.value)"></label>
        <label>${I18n.t('areaH')}<input type="number" value="${page.menuArea.h}" min="1" max="64" onchange="Editor.updatePageArea('h',+this.value)"></label>
        `}
        <div class="prop-actions">
            <button onclick="Editor.deletePage('${page.id}')">${I18n.t('deletePage')}</button>
        </div>`;
    }

    function renderItemProps(item, page) {
        const project = App.getProject();
        const subOpts = project.pages
            .map(p => `<option value="${p.id}" ${p.id === item.subMenuPageId ? 'selected' : ''}>${escHtml(p.name)}</option>`)
            .join('');

        const isWindow = item.callbackType === 'window' || item.callbackType === 'intWindow' || item.callbackType === 'floatWindow' || item.callbackType === 'textWindow';
        const hasData = item.callbackType === 'window' || item.callbackType === 'intWindow' || item.callbackType === 'floatWindow';

        if (!item.windowConfig) {
            item.windowConfig = { width: 80, height: 28, min: 0, max: 100, step: 5, value: 50 };
        }
        const wc = item.windowConfig;

        let html = `
        <h3>${I18n.t('itemPrefix')}</h3>
        <label>${I18n.t('itemText')}<input type="text" value="${escHtml(item.text||'')}" onchange="Editor.updateItem('text',this.value)"></label>
        <label>${I18n.t('action')}
            <select onchange="Editor.updateItem('callbackType',this.value)">
                <option value="none" ${item.callbackType==='none'?'selected':''}>${I18n.t('actionNone')}</option>
                <option value="back" ${item.callbackType==='back'?'selected':''}>${I18n.t('actionBack')}</option>
                <option value="textWindow" ${item.callbackType==='textWindow'?'selected':''}>文本窗口</option>
                <option value="intWindow" ${item.callbackType==='intWindow'?'selected':''}>整数滑块窗口</option>
                <option value="floatWindow" ${item.callbackType==='floatWindow'?'selected':''}>浮点滑块窗口</option>
                <option value="window" ${item.callbackType==='window'?'selected':''}>${I18n.t('actionWindow')}</option>
            </select>
        </label>
        <label>${I18n.t('subMenu')}
            <select onchange="Editor.updateItem('subMenuPageId',this.value||null)">
                <option value="">${I18n.t('noneSubMenu')}</option>
                ${subOpts}
            </select>
        </label>
        <label>${I18n.t('radioBox')}
            <select onchange="Editor.updateItemRadio(this.value)">
                <option value="none" ${item.radioBox===undefined?'selected':''}>${I18n.t('radioNone')}</option>
                <option value="true" ${item.radioBox===true?'selected':''}>${I18n.t('radioOn')}</option>
                <option value="false" ${item.radioBox===false?'selected':''}>${I18n.t('radioOff')}</option>
            </select>
        </label>`;

        if (isWindow) {
            html += `
        <h3>窗口设置</h3>
        <label>宽度<input type="number" value="${wc.width}" min="20" max="128" onchange="Editor.updateWindowConfig('width',+this.value)"></label>
        <label>高度<input type="number" value="${wc.height}" min="10" max="64" onchange="Editor.updateWindowConfig('height',+this.value)"></label>`;
        }
        if (hasData) {
            html += `
        <label>最小值<input type="number" value="${wc.min}" onchange="Editor.updateWindowConfig('min',+this.value)"></label>
        <label>最大值<input type="number" value="${wc.max}" onchange="Editor.updateWindowConfig('max',+this.value)"></label>
        <label>步长<input type="number" value="${wc.step}" step="any" onchange="Editor.updateWindowConfig('step',+this.value)"></label>
        <label>初始值<input type="number" value="${wc.value}" step="any" onchange="Editor.updateWindowConfig('value',+this.value)"></label>`;
        }

        html += `
        <div class="prop-actions">
            <button onclick="Editor.moveItem(-1)">${I18n.t('moveUp')}</button>
            <button onclick="Editor.moveItem(1)">${I18n.t('moveDown')}</button>
            <button onclick="Editor.deleteItem()">${I18n.t('deleteItem')}</button>
        </div>`;

        return html;
    }

    function selectPage(id) {
        selectedPageId = id;
        selectedItemIdx = -1;
        renderTree();
        renderProperties();
    }

    function selectItem(pageId, idx) {
        selectedPageId = pageId;
        selectedItemIdx = idx;
        renderTree();
        renderProperties();
    }

    function updatePage(key, value) {
        const page = App.getProject().pages.find(p => p.id === selectedPageId);
        if (!page) return;
        page[key] = value;
        App.rebuildAndInit();
        renderTree();
        renderProperties();
    }

    function updatePageArea(key, value) {
        const page = App.getProject().pages.find(p => p.id === selectedPageId);
        if (!page) return;
        page.menuArea[key] = value;
        App.rebuildAndInit();
    }

    function updateItem(key, value) {
        const page = App.getProject().pages.find(p => p.id === selectedPageId);
        if (!page || selectedItemIdx < 0) return;
        page.items[selectedItemIdx][key] = value;
        App.rebuildAndInit();
        renderTree();
        renderProperties();
    }

    function updateItemRadio(value) {
        const page = App.getProject().pages.find(p => p.id === selectedPageId);
        if (!page || selectedItemIdx < 0) return;
        if (value === 'none') page.items[selectedItemIdx].radioBox = undefined;
        else page.items[selectedItemIdx].radioBox = value === 'true';
        App.rebuildAndInit();
        renderProperties();
    }

    function updateWindowConfig(key, value) {
        const page = App.getProject().pages.find(p => p.id === selectedPageId);
        if (!page || selectedItemIdx < 0) return;
        const item = page.items[selectedItemIdx];
        if (!item.windowConfig) item.windowConfig = { width: 80, height: 28, min: 0, max: 100, step: 5, value: 50 };
        item.windowConfig[key] = value;
        App.rebuildAndInit();
        renderProperties();
    }

    function addPage() {
        const parentId = selectedPageId || null;
        const page = App.createPage('NewPage_' + App.genId(), {
            parentPageId: parentId
        });
        // Auto-add a menu item in the parent page linking to this new page
        if (parentId) {
            App.addItem(parentId, { text: page.name, subMenuPageId: page.id });
        }
        selectedPageId = page.id;
        selectedItemIdx = -1;
        App.rebuildAndInit();
        renderTree();
        renderProperties();
    }

    function addItemToSelected() {
        if (!selectedPageId) return;
        App.addItem(selectedPageId, { text: 'New Item' });
        App.rebuildAndInit();
        renderTree();
    }

    function deletePage(id) {
        const project = App.getProject();
        project.pages = project.pages.filter(p => p.id !== id);
        for (const p of project.pages) {
            if (p.parentPageId === id) p.parentPageId = null;
            for (const item of p.items) {
                if (item.subMenuPageId === id) item.subMenuPageId = null;
            }
        }
        if (project.rootPageId === id) {
            project.rootPageId = project.pages.length > 0 ? project.pages[0].id : null;
        }
        selectedPageId = null;
        selectedItemIdx = -1;
        App.rebuildAndInit();
        renderTree();
        renderProperties();
    }

    function deleteItem() {
        const page = App.getProject().pages.find(p => p.id === selectedPageId);
        if (!page || selectedItemIdx < 0) return;
        page.items.splice(selectedItemIdx, 1);
        selectedItemIdx = -1;
        App.rebuildAndInit();
        renderTree();
        renderProperties();
    }

    function moveItem(dir) {
        const page = App.getProject().pages.find(p => p.id === selectedPageId);
        if (!page || selectedItemIdx < 0) return;
        const newIdx = selectedItemIdx + dir;
        if (newIdx < 0 || newIdx >= page.items.length) return;
        const tmp = page.items[selectedItemIdx];
        page.items[selectedItemIdx] = page.items[newIdx];
        page.items[newIdx] = tmp;
        selectedItemIdx = newIdx;
        App.rebuildAndInit();
        renderTree();
        renderProperties();
    }

    function setupToolbar() {
        document.getElementById('btn-new-page')?.addEventListener('click', addPage);
        document.getElementById('btn-add-item')?.addEventListener('click', addItemToSelected);
        document.getElementById('btn-export-c')?.addEventListener('click', () => {
            const code = CodeGen.generate(App.getProject());
            document.getElementById('code-output').textContent = code;
            document.getElementById('code-panel').classList.add('open');
        });
        document.getElementById('btn-export-json')?.addEventListener('click', () => {
            const json = JSON.stringify(App.getProject(), null, 2);
            downloadFile('oled_ui_project.json', json, 'application/json');
        });
        document.getElementById('btn-import-json')?.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file'; input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const p = JSON.parse(ev.target.result);
                        App.setProject(p);
                        renderTree();
                        renderProperties();
                    } catch (err) { alert('Invalid JSON'); }
                };
                reader.readAsText(file);
            };
            input.click();
        });
        document.getElementById('btn-copy-code')?.addEventListener('click', () => {
            const code = document.getElementById('code-output').textContent;
            navigator.clipboard.writeText(code);
        });
        document.getElementById('btn-close-code')?.addEventListener('click', () => {
            document.getElementById('code-panel').classList.remove('open');
        });
        document.getElementById('btn-lang')?.addEventListener('click', () => {
            I18n.toggle();
            refreshUI();
        });
        document.getElementById('btn-clear-cache')?.addEventListener('click', () => {
            if (confirm(I18n.getLang() === 'zh' ? '确定清除所有缓存并恢复默认项目？' : 'Clear all cache and reset to default project?')) {
                localStorage.removeItem('oled_ui_project');
                location.reload();
            }
        });
    }

    function downloadFile(name, content, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = name;
        a.click();
        URL.revokeObjectURL(url);
    }

    function escHtml(s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    return {
        init, refreshUI, renderTree, renderProperties,
        selectPage, selectItem,
        updatePage, updatePageArea, updateItem, updateItemRadio, updateWindowConfig,
        addPage, addItemToSelected, deletePage, deleteItem, moveItem
    };
})();
