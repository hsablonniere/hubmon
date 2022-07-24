# hubmon

Run a command and restart it when file changes.

## Install

You can install this command line tool with npm like this:

```
npm install -g hubmon
```

## Usage

### Basic usage

If you want to run a command and rerun it each time a file changes, prefix your command with `hubmon`.

Here's an example if you want to execute `ls -la src`:

```
hubmon ls -la src
```

### Using the `--watch` option

By default, all files (except dotfiles) are watched (with the `**/*` glob pattern).
If you want to only watch some files, you can use a different glob pattern with the `--watch` option (or its short `-w` alias) like this:

```
hubmon --watch '*.txt' ls -la src
```

WARNING: the quote around the glob pattern is important.

### Defining aliases for script runners

If you often use `hubmon` with commands like `node`, `python` or `ruby`, it can be nice to set some aliases like these:

```
alias wnode='hubmon node'
alias wpython='hubmon python'
alias wruby='hubmon ruby'
```

This way, in a few keystrokes, you can add the letter `w` (like watch) at the beginning of your command to trigger hubmon's watching mechanism:

```
wnode my-script.js
```

### A note about Volta

If you're using Node.js with [volta](https://volta.sh/), we have a special trick for you.
By default, the way volta handles automatic version switch would break.
We added some special code so the versions you defined for `npm`, `yarn` and `node` are the right one.
