# SnooArchive

SnooArchive is a command-line Reddit submission and comment archiver that saves each item as a Markdown file in a folder.

_This script *only* saves text posts. It does not save offsite links or links to image galleries._

**Note: This is alpha software, and my first ever NodeJS project. There's always a chance you could encounter world-ending bugs. Use at your own risk.**

I created this because I have a few Reddit accounts with posts that I wanted to keep in an archive. Most of the scripts that I found would save these in a big HTML file. What I wanted instead were Markdown documents that I could easily import into one of my Markdown apps like iAWriter or Ulysses, or convert to a variety of other formats with Pandoc.

Fortunately, this was made even easier since Reddit includes both the Markdown version and the HTML version of the post in their JSON response file.

## Limitations

Reddit itself has API limitation that does not allow more than 1000 items in a response, so you may not get your whole history.

## Getting Started

This script was developed for [NodeJS](https://nodejs.org) version 6 (LTS) or above.

### To set up the script:

1. Clone this repository
2. On your computer, run `npm install` using the command line inside the repository folder
3. Create a Reddit API key and setup the `.env` file (see below)

### Get a Reddit API key

1. Log into your Reddit account
2. Navigate to https://ssl.reddit.com/prefs/apps/
3. Scroll to the bottom and click "create an app.."
4. In the form, name it "SnooArchive"
5. Select "script" as the application type
6. You can safely ignore 'description' and 'about url'
8. 'Redirect url' is required, but it can be anything—I used my Reddit profile URL
9. Click "create app"

Note the string of characters below the app name. This is your `CLIENT_ID`.
Note the string of characters beside the word "secret". This is your `CLIENT_SECRET`.

### Setup the .env file

1. In a text editor, open the `env.example` file
2. As noted above, copy and paste in the value for `CLIENT_ID`
3. Copy and paste in the value for `CLIENT_SECRET`
4. Insert your Reddit username and password
5. Save the file as `.env` in the same directory

## Using the Script

### Archiving Your Submissions

The script's default action is to collect all of your submissions (to the Reddit limit of 1000) and save them in a folder called `./submissions` with a unique set of numbers.

```bash
node snooarchive.js
```

### Archiving Your Comments

To download comments, use the `-c` or `--comments` flag. Comments will download into a directory called `./comments` followed by a unique set of numbers.

```bash
node snooarchive.js -c
```

### Archiving Your Saved Items

To download saved items, use the `-s` or `--saved` flag. Saved items will download into a directory called `./saved` followed by a unique set of numbers.

```bash
node snooarchive.js -s
```

### Filter by Minimum Upvote

Especially with comments, sometimes the content isn't very valuable. To filter by upvotes, add use the `-u` or `--upvotes` flag followed by a number. This will add a `-n` between the folder name and unique set of numbers, where 'n' is the minimum upvotes specified.

**Submissions**
```bash
node snooarchive.js -u 10
```

**Comments**
```bash
node snooarchive.js -c -u 10
```

**Saved**
```bash
node snooarchive.js -s -u 10
```

## Contributions

Let me know if you'd like to see a feature in the "issues" section of this repo. I'm also happy to take a look at pull requests if anyone is inspired to contribute.

## Thanks

SnooArchive would not be possible without the brilliant work of the devs who created [**snoowrap**](https://github.com/not-an-aardvark/snoowrap), the JavaScript Reddit API wrapper.

## License

I'm releasing this under the [ISC License](https://en.wikipedia.org/wiki/ISC_license) which is fully MIT/BSD/GPL compatible with even fewer words.

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
