#!/usr/bin/env node

/**
 * 本文件的作用是将lib生成的结果写入到文件中
 * **/

var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
var tildify = require('tildify')
var ora = require('ora')
var projectPath = process.cwd()
var bundleFile = require('../lib/index')

var configPath = path.join(projectPath, 'tinypack.config.js')

function init() {
    // ora是是一个loading效果的包 开始loading
    var spinner = ora('正在打包配置文件...')
    spinner.start()

    if (!fs.existsSync(configPath)) {
        spinner.stop()
        chalk.red('找不到 "tinypack.config.js" 配置文件.')
    }

    var config = require(configPath)

    const result = bundleFile(config)

    // result 是一个字符串 将字符串写入到配置的output文件中
    try {
        fs.writeFileSync(path.join(projectPath, config.output), result)
    } catch (e) {
        // 没有则先创建文件，然后写入
        fs.mkdirSync(path.dirname(config.output))
        fs.writeFileSync(path.join(projectPath, config.output), result)
    }

    // ora结束loading
    spinner.stop()
    chalk.yellow('已生成对应文件.')
}

init()
