#!/usr/bin/env node

import chokidar from 'chokidar';
import debounceFn from 'debounce-fn';
import minimist from 'minimist';
import chalk from 'chalk';
import { spawn } from 'child_process';

// SETUP
const hubmonOptions = minimist(process.argv.slice(2));
const [commandName, ...commandArgs] = hubmonOptions._;
const watchPattern = hubmonOptions.watch ?? '**/*';

// GLOBAL STATE
let iteration = -1;
let commandProcess;

// Start the command in another process with childProcess.spawn()
function startProcess () {

  iteration += 1;
  commandProcess = spawn(commandName, commandArgs);

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
}

// Cleanup listeners, log and force kill process
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

// Watch file system according to watch pattern option
const watcher = chokidar.watch(watchPattern, {
  // ignore dotfiles
  ignored: /(^|[\/\\])\../,
  persistent: true,
  ignoreInitial: true,
});

// Avoid restarting too much with multiple file changes
const startProcessDebounced = debounceFn(startProcess, { wait: 100 });

// On each file change, try to stop process, log and eventually start a new process
watcher.on('all', (event, path, stats) => {
  endProcess();
  console.log(chalk.yellow(`[hubmon] (${event}) ${path}`));
  startProcessDebounced();
});

// First start
startProcess();
