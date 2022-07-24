# hubmon

Run a command and restart it when file changes.

## Install

You can install this command line tool with npm like this:

```
npm install -g hubmon
```

If you're using volta, you can also install it like this

```
volta install hubmon
```

## Usage

### Basic usage

If you want to run a command and rerun it each time a file changes, prefix your command with `hubmon`.

Here's an example if you want to execute `ls -la src`:

```js
hubmon ls -la src
```

### Using the `--watch` option

By default, all files (except dotfiles) are watched (with the `**/*` glob pattern).
If you want to only watch some files, you can use a different glob pattern with the `--watch` option (or its short `-w` alias) like this:

```js
hubmon --watch '*.txt' ls -la src
```

WARNING: the quote around the glob pattern is important.

### Using it with an alias for node

If you often use `hubmon` with script runners like Node.js, Python or Ruby, it can be nice to set some aliases like these:

```js
alias wnode='hubmon node'
alias wpython='hubmon python'
alias wruby='hubmon ruby'
```

This way, in a few keystrokes, you can add the letter `w` at the beginning of your command to trigger hubmon's watching mechanism:

```
wnode my-script.js
```
