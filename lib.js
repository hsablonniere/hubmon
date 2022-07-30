#!/usr/bin/env node

import chalk from 'chalk';
import { spawn } from 'child_process';
import chokidar from 'chokidar';

// Dead simple parse arguments for `--watch` or `-w` at the beginning of the command
export function getOptionsAndCommand () {
  const args = process.argv.slice(2);
  const hasWatchArgument = args[0] === '--watch' || args[0] === '-w';
  if (hasWatchArgument) {
    return {
      watchPatterns: args[1].split(','),
      commandName: args[2],
      commandArgs: args.slice(3),
    };
  }
  return {
    commandName: args[0],
    commandArgs: args.slice(1),
  };
}

// Start the command in another process with childProcess.spawn()
export function startProcess (commandName, commandArgs, iteration) {

  let commandProcess = spawn(commandName, commandArgs);

  function endProcess () {

    if (commandProcess == null) {
      return;
    }

    const { exitCode } = commandProcess;

    // Remove all event listneners (not sure if it's required)
    commandProcess.stdout.removeAllListeners('data');
    commandProcess.stderr.removeAllListeners('data');
    commandProcess.removeAllListeners('close');

    if (exitCode == null) {
      console.log(chalk.red(`[hubmon] process killed due to file change`));
    }
    else if (exitCode === 0) {
      console.log(chalk.green(`[hubmon] process stopped (${commandProcess.exitCode})`));
    }
    else {
      console.log(chalk.red(`[hubmon] process stopped (${commandProcess.exitCode})`));
    }

    commandProcess.kill();
    commandProcess = null;
  }

  const date = new Date().toISOString()
    .slice(0, 'XXXX-XX-XXTXX:XX:XX'.length)
    .replace('T', '  ');

  console.log([
    chalk.yellow(`[hubmon] ${date}`),
    chalk.yellow(`${chalk.white('pid:')}${commandProcess.pid}`),
    chalk.yellow(`${chalk.white('iteration:')}${iteration}`),
  ].join('  '));

  commandProcess.stdout.on('data', (data) => {
    process.stdout.write(data.toString());
  });

  commandProcess.stderr.on('data', (data) => {
    process.stderr.write(data.toString());
  });

  commandProcess.on('close', () => {
    endProcess();
  });

  // Cleanup listeners, log and force kill process
  return endProcess;
}

export function watchFiles (watchPatterns, callback) {

  // Watch file system according to watch pattern option
  const watcher = chokidar.watch(watchPatterns, {
    // ignore dotfiles
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true,
  });

  // On each file change, try to stop process, log and eventually start a new process
  watcher.on('all', callback);
}
