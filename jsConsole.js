var BD = function(args)
{
	const fs = require('fs');
	const path = require('path');

	function copyDir(src, dest)
	{
		if(!fs.existsSync(dest))
			fs.mkdirSync(dest);
		fs.readdirSync(src).forEach(function(f)
		{
			var srcF = path.join(src, f);
			var destF = path.join(dest, f);
			var stat = fs.statSync(srcF);

			if(stat && stat.isDirectory())
			{
				if(fs.existsSync(destF))
				{
					if(!fs.statSync(destF).isDirectory())
						throw("Error creating " + destF + ": a file with the same name already exists");
				} else
					fs.mkdirSync(destF);
				
				copyDir(srcF, destF);
			} else {
				fs.writeFileSync(destF, fs.readFileSync(srcF));
			}
		});
		return true;
	}

	function rmDir(dir)
	{
		dir = path.resolve(dir);
		if(fs.exists(dir) && fs.statSync(dir).isDirectory())
		{	
			fs.readdirSync(dir).forEach(function(f)
			{
				f = path.join(dir, f);
				if(fs.statSync(f).isDirectory())
					rmDir(f)
				else
					fs.unlinkSync(f);
			});
			fs.rmdirSync(dir);
		}
	}

	process.chdir(path.dirname(require.resolve('discord_desktop_core')));
	if(args.css)
		args.css = path.resolve(args.css);
	else
		args.css = path.resolve('./discord-custom.css');

	if(args.js)
		args.js = path.resolve(args.js);
	else
		args.js = path.resolve('./discord-custom.js');

	if(args.revert)
	{
		//rmDir('./core');
		fs.writeFileSync('./index.js', "module.exports = require('./core.asar');");
		setTimeout(function(){process.kill(process.pid);}, 1000);
		return;
	}
	copyDir('./core.asar', './core');
	if(!fs.existsSync(args.css))
		fs.writeFileSync(args.css, '/* put your custom css here. */\n', {encoding: 'utf8'});
	if(!fs.existsSync(args.js))
		fs.writeFileSync(args.js, '// put your custom JS here.\n', {encoding: 'utf8'});

	injectionScript = `
window._fs = require("fs");

window._cssWatcher = null;
window._styleTag = null;

window._scriptTag = null;

window.setupCSS = function (path) {
	var customCSS = window._fs.readFileSync(path, "utf8");
	if (window._styleTag === null) {
		window._styleTag = document.createElement("style");
		document.head.appendChild(window._styleTag);
	}
	window._styleTag.innerHTML = customCSS;
	if (window._cssWatcher === null) {
		window._cssWatcher = window._fs.watch(path, {
				encoding: "utf8"
			},
			function (eventType, filename) {
				if (eventType === "change") {
					var changed = window._fs.readFileSync(path, "utf8");
					window._styleTag.innerHTML = changed;
				}
			}
		);
	}
};

window.tearDownCSS = function () {
	if (window._styleTag !== null) {
		window._styleTag.innerHTML = "";
	}
	if (window._cssWatcher !== null) {
		window._cssWatcher.close();
		window._cssWatcher = null;
	}
};

window.applyAndWatchCSS = function (path) {
	window.tearDownCSS();
	window.setupCSS(path);
};

window.applyAndWatchCSS('${args.css.replace(/\\/g, '\\\\')}');

window.setupJS = function (path) {
	var customJS = window._fs.readFileSync(path, "utf8");
	if (window._scriptTag === null) {
		window._scriptTag = document.createElement("script");
		document.head.appendChild(window._scriptTag);
	}
	window._scriptTag.innerHTML = customJS;
};

window.tearDownJS = function () {
	if (window._scriptTag !== null) {
		window._scriptTag.innerHTML = "";
	}
};

window.applyJS = function (path) {
	window.tearDownJS();
	window.setupJS(path);
};

window.applyJS('${args.js.replace(/\\/g, '\\\\')}');
window.BD = ${BD.toString()}
`;
	if(args.node)
		injectionScript += `module.paths.push('${path.resolve(args.node).replace(/\\/g, '\\\\')}')`;
	
	fs.writeFileSync('./codeInjection.js', injectionScript, {encoding: 'utf8'});
	injPath = path.resolve('./codeInjection.js').replace(/\\/g, '\\\\');
	reloadScript = `//BeautifulDiscord injection start
mainWindow.webContents.on('dom-ready', function () {
	mainWindow.webContents.executeJavaScript(
		require('fs').readFileSync('${injPath}', 'utf8')
	);
});
//BeautifulDiscord injection end`;
	var entireThing = fs.readFileSync('./core/app/mainScreen.js', 'utf8');

	if(entireThing.match("mainWindow.webContents.on('dom-ready', function () {});") !== null)
		entireThing = entireThing.replace("mainWindow.webContents.on('dom-ready', function () {});", reloadScript);
	else if(entireThing.match(reloadScript) === null)
		entireThing = entireThing.replace("mainWindow.webContents.on", reloadScript + '\nmainWindow.webContents.on');
	if(args.fixCORS && entireThing.match("webSecurity: false, blinkFeatures: '") === null)
		entireThing = entireThing.replace("blinkFeatures: '", "webSecurity: false, blinkFeatures: '");

	fs.writeFileSync('./core/app/mainScreen.js', entireThing, {encoding: 'utf8'});

	fs.writeFileSync('./index.js', "module.exports = require('./core/app/index.js');");
	process.kill(process.pid);
};
