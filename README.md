# hubmon

Run a command, watch the filesystem, stop the process on file change and then run the command again...

## Install

You can install this command line tool with npm like this:

```
npm install -g hubmon
```

## Usage

### Basic usage

`hubmon` must be used as a prefix before the command you want to run.

Here's an example on how to use `hubmon` with a command like `ls -la src`:

```
hubmon ls -la src
```

In this example, `hubmon` will:

* watch the filesystem for changes
* run the command `ls -la src`

On each filesystem change, `hubmon` will:

* kill the process if it's still running
* run the command `ls -la src` again

NOTE: Killing the process if it's still running is very useful if you command runs an HTTP server for example.

### Using the `--watch` option

By default, all files (except dotfiles) are watched (with the `**/*` glob pattern).
If you want to only watch some files, you can use a different glob pattern with the `--watch` option (or its short `-w` alias) like this:

```
hubmon --watch '*.txt' ls -la src
```

WARNING: the quote around the glob pattern is important.

### Using the `--watch` option with multiple patterns

You can pass multiple patterns by join them with a comma like this:

```
hubmon --watch '*.txt,*.sql' ls -la src
```

### Ignoring files with the `--watch` option

If you want to ignore some files, you can use patterns prefixed with `!`.

Here's an example where you watch all files in `src` but not the `.sql` files:

```
hubmon --watch 'src/**/*,!src/**/*.sql' ls -la src
```

Under the hood, `hubmon` uses [picomatch](https://github.com/micromatch/picomatch) for glob patterns, please refer to their docs for more details.

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
