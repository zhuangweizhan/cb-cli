const dir = process.cwd()

const execa = require('execa')
const fs = require('fs-extra')
const path = require('path')

async function create(projectPath) {
  // package.json 文件内容
  const packageObject = {
    name: projectPath,
    version: '0.1.0',
    dependencies: {
      vue: '^2.6.12',
    },
    devDependencies: {},
  }

  const packagePath = projectPath + '/package.json'

  const filePath = path.join(dir, packagePath)
  fs.ensureDirSync(path.dirname(filePath))
  fs.writeFileSync(filePath, JSON.stringify(packageObject))

  console.log('\n正在下载依赖...\n', filePath)
  // // 下载依赖
  execa('npm install', [], {
    cwd: path.join(dir, projectPath),
    stdio: ['inherit', 'pipe', 'inherit'],
  })

  console.log(`下载成功 ${projectPath}`)
  console.log(`cd ${projectPath}`)
  console.log(`npm run dev`)
}

module.exports = create
