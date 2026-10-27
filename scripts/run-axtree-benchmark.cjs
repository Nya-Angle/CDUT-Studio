#!/usr/bin/env node
const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const electronExe = path.resolve(__dirname, '../node_modules/electron/dist/electron.exe');
const scriptPath = path.resolve(__dirname, 'benchmark-axtree-compression.cjs');

if (!fs.existsSync(electronExe)) {
  console.error(`[Error] 未找到 Electron 执行程序: ${electronExe}`);
  process.exit(1);
}

console.log(`[AXTree Benchmark Runner] 正在启动 Chromium / Electron 实测套件...`);
const child = cp.spawn(electronExe, [scriptPath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ELECTRON_ENABLE_LOGGING: '1',
  }
});

child.on('exit', (code) => {
  console.log(`\n[AXTree Benchmark Runner] 测试进程退出，退出码: ${code}`);
  process.exit(code || 0);
});
