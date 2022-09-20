import _, { List } from "lodash";
import execa from "execa";

export type TerraformConfig = {
  logLevel?: string;
  workspace: string;
  templateDirectory?: string;
};

export type StdioHandler = "inherit" | "pipe";

const defaultConfig: TerraformConfig = {
  logLevel: "INFO",
  workspace: "default",
  templateDirectory: "default"
};

export class Terraformer {
  private readonly logLevel?: string;
  private readonly workspace: string;
  private readonly templateDirectory?: string;
  constructor(options: TerraformConfig) {
    this.logLevel = options.logLevel || defaultConfig.logLevel;
    this.workspace = options.workspace || defaultConfig.workspace;
    this.templateDirectory =
      options.templateDirectory || defaultConfig.templateDirectory;
  }
  private async setWorkspace() {
    if (this.workspace !== this.templateDirectory) {
      // process.chdir(this.workspace);
      const command = `cp -a ${this.templateDirectory}/. ${this.workspace}`;
      await execa.execaCommand(command, {
        stdio: "inherit"
      });
    }
  }
  private async initialize() {}
  async setup() {
    await this.setWorkspace();
    await this.initialize();
  }
  async apply() {
    const options = ["apply", "-auto-approve"];
    await this.execute(options, "inherit");
  }
  async destroy() {
    const options = ["destroy", "-auto-approve"];
    await this.execute(options, "inherit");
  }
  async output() {
    const options = ["output", "-json"];
    return (await this.execute(options, "pipe")).stdout;
  }
  async getState() {
    const options = ["show", "-json"];
    const state = await this.execute(options, "pipe");
    return JSON.parse(state.stdout);
  }
  private async execute(parameters: Array<string>, stdioHandler: StdioHandler) {
    const commandOpts = parameters.join(" ");
    const logLevel = _.defaultTo(process.env.TF_LOG, this.logLevel);
    const command = `terraform ${commandOpts}`;
    try {
      return await execa.execaCommand(command, {
        stdio: stdioHandler,
        shell: true,
        env: {
          TF_INPUT: "false",
          TF_LOG: logLevel,
          TF_IN_AUTOMATION: "true",
          TF_CLI_ARGS_import: "-no-color",
          TF_CLI_ARGS_apply: "-no-color",
          TF_CLI_ARGS_init: "-no-color",
          TF_CLI_ARGS_destroy: "-no-color"
        }
      });
    } catch (err) {
      console.log(`Failed to execute command: ${command} with error: `, err);
      throw err;
    }
  }
}
