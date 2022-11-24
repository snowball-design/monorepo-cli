const path = require("path");
const fs = require("fs").promises;
const inquirer = require("inquirer");
const { PROJECT_PATH, TEMPLATE_PATH, log } = require("../utils");
/** 模板文件地址 */

module.exports = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "projectName",
        message: "请输入项目名",
        filter(val) {
          return val ? val : "monorepo-project";
        },
      },
      {
        type: "list",
        name: "language",
        message: "请选择语言类型",
        choices: ["TypeScript", "JavaScript"],
        filter(val) {
          return val;
        },
      },
      {
        type: "confirm",
        name: "test",
        message: "是否需要单元测试",
      },
      {
        type: "confirm",
        name: "playground",
        message: "是否需要Playground",
      },
    ])
    .then((answers) => {
      log.blue(PROJECT_PATH, TEMPLATE_PATH);
      log.blue("answers", answers);
      let { projectName, language, test, playground } = answers;

      fs.access(projectPath, fs.constants.F_OK).then(
        () => {
          log.error(`目录 ${projectPath} 已经存在！`);
        },
        () => {
          fs.mkdir(projectName);
        }
      );
    });
};
