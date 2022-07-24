#!/usr/bin/env node

import debounceFn from 'debounce-fn';
import chalk from 'chalk';
import { getOptionsAndCommand, startProcess, watchFiles } from './lib.js';

// Global state
let iteration = -1;
let stopProcess = () => null;

const { watchPattern = '**/*', commandName, commandArgs } = getOptionsAndCommand();

// Debounce to avoid restarting too much with multiple consecutive file changes
const startProcessDebounced = debounceFn(() => {
  iteration += 1;
  stopProcess = startProcess(commandName, commandArgs, iteration);
}, { wait: 100 });

// On each file change, try to stop process, log and eventually start a new process
watchFiles(watchPattern, (event, path) => {
  stopProcess();
  console.log(chalk.yellow(`[hubmon] (${event}) ${path}`));
  startProcessDebounced();
});

// First start
startProcessDebounced();
