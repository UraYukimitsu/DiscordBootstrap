# DiscordBootstrap
Everything you ever wanted from BeautifulDiscord, and even more

This is a very simple JS script that adds (semi) persistent custom CSS and JS loading to Discord.

## Usage
From your Discord client, open the JS console (Ctrl+Shift+I - or Cmd+Shift+I on Mac OS I suppose), and click on the
`Console` tab. You'll be met with a warning telling you that you have a 110% chance I'm scamming you. Here, paste the
contents of `jsConsole.js` and press Enter.

After that, you can load CSS and JS into your Discord client easily with a command like
`BD('/absolute/path/to/theme.css', '/absolute/path/to/script.js',)`

Of course, if you're using Windows don't forget to escape every backslash in your paths (`\\`).

At this point, a file selection dialog box will open. Please paste the contents of your clipboard in the file name text box and press enter. If you are prompted to replace (or overwrite) the file, select "Yes".

Once your theme is installed, if you want to revert to the vanilla version of Discord, open the dev tools console and type `theme.uninstall()`
