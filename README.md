# DiscordBootstrap
Everything you ever wanted from BeautifulDiscord, and even more

This is a very simple JS script that adds (semi) persistent custom CSS and JS loading to Discord.

## Usage
From your Discord client, open the JS console (Ctrl+Shift+I - or Cmd+Shift+I on Mac OS I suppose), and click on the
`Console` tab. You'll be met with a warning telling you that you have a 110% chance I'm scamming you. Here, paste the
contents of `jsConsole.js` and press Enter.

### An additional step may be required depending on your version of Discord - instructions will appear on-sceen if needed.
### Make sure your JS console is logging *ALL* messages if that additional step is required.

After that, you can load CSS and JS into your Discord client easily with a command like
`BD({css: '/absolute/path/to/theme.css', js:'/absolute/path/to/script.js', node:'/absolute/path/to/node_modules'})`

All the arguments are optional.
Of course, if you're using Windows don't forget to escape every backslash in your paths (`\\`).

And you can revert any change made to your Discord client with
`BD({revert: true})`
