const path = require("path");
const fs = require("fs").promises;
const inquirer = require("inquirer");
const package = require("../templates/package.json");

const { PROJECT_PATH, TEMPLATE_PATH, log, createFile } = require("../utils");

function move(arrs, to) {
  arrs
    .map((arr) => ({ name: arr, path: path.join(TEMPLATE_PATH, arr) }))
    .forEach((arr) => {
      fs.copyFile(arr.path, path.join(to, arr.name));
    });
}

function initProject(config) {
  let { projectName, language, test } = config;
  const _package = package;
  let deps = [];
  _package.name = projectName;
  const needmove = [".gitignore", ".npmrc", "pnpm-workspace.yaml"];
  if (language == "TypeScript" && !needmove.includes("tsconfig.json")) {
    needmove.push("tsconfig.json");
    deps.push(
      { name: "typescript", vertion: "^4.7.4" },
      { name: "@vue/tsconfig", vertion: "^0.1.3" }
    );
  }
  if (test && !needmove.includes("vitest.config.ts")) {
    needmove.push("vitest.config.ts");
    fs.mkdir(path.join(projectName, "test"));
    deps.push({ name: "vitest", vertion: "^0.21.0" });
  }

  deps.forEach((dep) => {
    _package.dependencies[dep.name] = dep.vertion;
  });

  return new Promise((resolve) => {
    const rootPath = path.join(PROJECT_PATH, projectName);
    move(needmove, rootPath);
    createFile(
      path.join(rootPath, "package.json"),
      JSON.stringify(_package, null, 2)
    );
    resolve();
  });
}

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
      // {
      //   type: "confirm",
      //   name: "playground",
      //   message: "是否需要Playground",
      // },
    ])
    .then((answers) => {
      let { projectName } = answers;
      fs.access(projectName, fs.constants.F_OK).then(
        () => {
          log.error(`目录 ${projectName} 已经存在！`);
        },
        () => {
          fs.mkdir(projectName)
            .then(() => {
              // 初始化项目
              fs.mkdir(path.join(projectName, "packages"));
              return initProject(answers);
            })
            .then(() => {
              log.success("项目构建成功");
              log.default(`
cd ${projectName}
pnpm install
              `);
            });
        }
      );
    });
};
