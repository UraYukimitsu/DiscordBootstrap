function BD(css_path, js_path) {
    var fm = DiscordNative.fileManager;
    var f = fm.join(fm.dirname(DiscordNative.processUtils.getMainArgvSync()[0]), 'modules', 'discord_desktop_core-' + DiscordNative.app.getModuleVersions()['discord_desktop_core'], 'discord_desktop_core');
    var id = `var e = require("fs"),
    t = require("path"),
    r = '${f.replace(/\\/g, '\\\\')}';
    w = e.writeFileSync;

    function o(i, n) {
        return e.existsSync(n) || e.mkdirSync(n), e.readdirSync(i).forEach((r) => {
            var c = t.join(i, r);
            r = t.join(n, r);
            var a = e.statSync(c);
            if (a && a.isDirectory()) {
                if (e.existsSync(r)) {
                    if (!e.statSync(r).isDirectory()) throw r
                } else e.mkdirSync(r);
                o(c, r)
            } else w(r, e.readFileSync(c))
        }), !0
    }
    o(r + "/core.asar", r + "/c");
    rs = "mainWindow.webContents.on('dom-ready', function () { \\
        var _fs = require('fs'); \\
        var css_path = '${css_path.replace(/\\/g, '\\\\\\\\')}'; \\
        var js_path = '${js_path.replace(/\\/g, '\\\\\\\\')}'; \\
        var css = _fs.readFileSync(css_path); \\
        var sc = _fs.readFileSync(js_path); \\
        mainWindow.webContents.executeJavaScript('var theme_elem = document.createElement(\\\\'style\\\\');theme_elem.innerHTML = \`' + css + '\`;document.head.appendChild(theme_elem);' + sc); \\
        _fs.watch(css_path, { encoding: 'utf8' }, function(event, filename) \\
        { \\
            if(event !== 'change') return; \\
            var css = _fs.readFileSync(css_path); \\
            mainWindow.webContents.executeJavaScript('window.theme_elem.innerHTML = \`' + css + '\`;'); \\
        }); \\
    });";
    et = e.readFileSync(r + "/c/app/mainScreen.js", "utf8")
    w(r + "/c/app/mainScreenPreload.js", e.readFileSync(r + "/c/app/mainScreenPreload.js", "utf8").replace('process.once(\\'loaded\\',', 'contextBridge.exposeInMainWorld("theme", { uninstall: function() { require("fs").writeFileSync("${fm.join(f, 'index.js').replace(/\\/g, '\\\\\\\\')}", "module.exports = require(\\'./core.asar/app/index.js\\')", "utf8"); DiscordNative.app.relaunch() } })\\nprocess.once(\\'loaded\\','), "utf8")
    if(et.match(rs) == null) et = et.replace("mainWindow.webContents.on", rs + "\\nmainWindow.webContents.on")
    w(r + "/c/app/mainScreen.js", et, "utf8")
    module.exports = require('./c/app/index.js')
    w(r + "/index.js", "module.exports = require('./c/app/index.js')", "utf8")`;
    DiscordNative.clipboard.copy(fm.join(f, 'index.js'));
    fm.saveWithDialog(id, 'Please_paste_the_contents_of_your_clipboard_here', f).then(a => DiscordNative.app.relaunch());
}
