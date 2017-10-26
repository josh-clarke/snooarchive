# SnooArchive

SnooArchive is a Reddit submission and comment archiver that saves each item as a Markdown file in a folder. 

**Note: This is alpha software, and my first ever NodeJS project. There's always a chance you could encounter world-ending bugs. Use at your own risk.**

I created this because I have a few Reddit accounts with posts that I wanted to keep in an archive. Most of the scripts that I found would save these in a big HTML file. What I wanted instead were Markdown documents that I could easily import into one of my Markdown apps like iAWriter or Ulysses, or convert to a variety of other formats with Pandoc.

Fortunately, this was made even easier since Reddit includes both the Markdown version and the HTML version of the post in their JSON response file.

## Limitations

Reddit itself has API limitation that does not allow more than 1000 items in a response, so you may not get your whole history.

## Getting Started

This script requires [Node.JS](https://nodejs.org). I developed it on the latest Node.JS 8+, but it should work if you have at least NodeJS LTS 6+.

### To set up the script:

1. Clone this repository
2. On your computer, run `npm install` using the command line inside the repository folder
3. Create a Reddit API key and setup the `config.json` file (see below)

### Get an API key & setup the config file

1. Log into your Reddit account 
2. Navigate to https://ssl.reddit.com/prefs/apps/
3. Scroll to the bottom and click "create an app.."
4. In the form, name it "SnooArchive"
5. Select "script" as the application type
6. "Description" can be left blank
7. "About URL" can be left blank
8. "Redirect URL" is required, but it can be anything; I used my Reddit profile URL
9. Click "create app"
10. In a text editor, open the `config.json.example` file
11. Back in your browser, copy and paste the string of letters and numbers under the app name into the config file as the value for `"clientId"`
12. Copy and paste the string of characters beside "secret" into the config file as the value for `"clientSecret"`
13. Insert your username and password into the config file
14. Save the file as `config.json`

## Using the Script

The script's default action is to collect all of your submissions (to the Reddit limit of 1000) and save them in a folder called `./submissions`.

```bash
node snooarchive.js
```

To download comments, use the `-c` or `--comments` flag. Comments will download into a directory called `./comments`

```bash
node snooarchive.js -c
```

## Roadmap

The features I am planning to add are:

* Ability to download saved posts
* Ability to filter submissions, comments, and saved posts by a minimum upvote level (i.e., only get the good stuff)


## Contributions

I'm happy to take a look at pull requests if anyone is inspired to contribute. 


## License

I'm releasing this under the [ISC License](https://en.wikipedia.org/wiki/ISC_license) which is fully MIT/BSD/GPL compatible with even fewer words.