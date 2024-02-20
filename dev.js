
import chokidar from 'chokidar';
import esbuild from 'esbuild';
import shelljs from 'shelljs';

let devServer;
const build = process.argv[2] === '--build';

if(build){
  await buildServerFiles();
  await buildClientFiles();
}else{
  initAndWatchForFileChanges(async () => {
    await stopDevServer();
    await buildServerFiles();
    await buildClientFiles();
    await runDevServer();
  });
}

async function initAndWatchForFileChanges(callback){
  callback();
  chokidar.watch('src').on('change', (event, path) => {
    callback();
  });
}

async function stopDevServer(){
  if(devServer){
    console.log('\x1b[90m%s\x1b[0m', '[dev] stop dev server..');
    await devServer.kill();
    devServer = null;
  }
}

async function buildServerFiles(){
  console.log('\x1b[90m%s\x1b[0m', '[dev] build server files..');
  await esbuild.build({
    entryPoints: ['src/server/main.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: 'dist/server.js',
    format: 'esm',
    packages: 'external'
  }).catch(console.error);
}

async function buildClientFiles(){
  console.log('\x1b[90m%s\x1b[0m', '[dev] build client files..');
  await esbuild.build({
    entryPoints: ['src/client/index.ts'],
    bundle: true,
    outfile: 'public/~/client.js',
    format: 'esm'
  }).catch(console.error);
}

async function runDevServer(){
  console.log('\x1b[90m%s\x1b[0m', '[dev] run dev server..');
  devServer = shelljs.exec('node dist/server.js', { async: true });
}
