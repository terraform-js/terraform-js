import _ from "lodash";
import execa from "execa";

export type TerraformConfig = {
  logLevel?: string;
  workspace: string;
  templateDirectory?: string;
};

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
  private initialize() {}
  private async setup() {}
}
