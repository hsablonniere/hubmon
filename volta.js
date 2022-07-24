import { spawnSync } from 'child_process';

function getVersionFromVolta (commandName) {

  const rawOutput = spawnSync('volta', ['list', commandName, '--format', 'plain']).stdout.toString();

  const rawVersionLines = rawOutput.split('\n');
  const currentVersionLine = rawVersionLines.find((v) => {
    return false
      || v.includes('(current @')
      || v.includes('(default)');
  });

  const version = currentVersionLine.match(/@(?<version>\S+)/)?.groups.version;

  return version;
}

export function patchVoltaPath () {

  const npmVersion = getVersionFromVolta('npm');
  const yarnVersion = getVersionFromVolta('yarn');
  const nodeVersion = getVersionFromVolta('node');

  process.env.PATH = process.env.PATH
    .split(':')
    .map((pathPart) => {
      return pathPart
        .replace(/^(.*)\/\.volta\/tools\/image\/npm\/(?:\S+)\/bin$/, `$1/.volta/tools/image/npm/${npmVersion}/bin`)
        .replace(/^(.*)\/\.volta\/tools\/image\/yarn\/(?:\S+)\/bin$/, `$1/.volta/tools/image/yarn/${yarnVersion}/bin`)
        .replace(/^(.*)\/\.volta\/tools\/image\/node\/(?:\S+)\/bin$/, `$1/.volta/tools/image/node/${nodeVersion}/bin`);
    })
    .join(':');
}


