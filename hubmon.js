#!/usr/bin/env node

import debounceFn from 'debounce-fn';
import chalk from 'chalk';
import { getOptionsAndCommand, startProcess, watchFiles } from './lib.js';
import { patchVoltaPath } from './volta.js';

// Global state
let iteration = -1;
let stopProcess = () => null;

const { watchPatterns = ['**/*'], commandName, commandArgs } = getOptionsAndCommand();

// This tool is sometimes used with Node.js AND Volta
// They way Volta works means the pinned version of node, yarn or npm won't always be the right one
try {
  patchVoltaPath();
}
catch (e) {
  // Probably means volta isn't installed
}

// Debounce to avoid restarting too much with multiple consecutive file changes
const startProcessDebounced = debounceFn(() => {
  iteration += 1;
  stopProcess = startProcess(commandName, commandArgs, iteration);
}, { wait: 100 });

// On each file change, try to stop process, log and eventually start a new process
watchFiles(watchPatterns, (event, path) => {
  stopProcess();
  console.log(chalk.yellow(`[hubmon] (${event}) ${path}`));
  startProcessDebounced();
});

// First start
startProcessDebounced();
