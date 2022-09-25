import _ from 'lodash';
import {execaCommand} from 'execa';

export type TerraformConfig = {
  logLevel?: string;
  workspace: string;
  templateDirectory?: string;
  pluginDirectory?: string | null;
  workingDirectory: string;
};

export type TerraformOutput = {
  stdout: string;
};

export type StdioHandler = 'inherit' | 'pipe';

const defaultConfig: TerraformConfig = {
  logLevel: 'INFO',
  workspace: 'default',
  pluginDirectory: null,
  templateDirectory: '.',
  workingDirectory: '.'
};

export class Terraformer {
  private readonly logLevel?: string;
  private readonly workspace: string;
  private readonly workingDirectory: string;
  private readonly templateDirectory?: string;
  private readonly pluginDirectory?: string | null;
  constructor(options: TerraformConfig) {
    this.logLevel = options.logLevel || defaultConfig.logLevel;
    this.workspace = options.workspace || defaultConfig.workspace;
    this.workingDirectory = options.workingDirectory || defaultConfig.workingDirectory;
    this.templateDirectory = options.templateDirectory || defaultConfig.templateDirectory;
    this.pluginDirectory = options.pluginDirectory || defaultConfig.pluginDirectory;
  }
  private async setup(): Promise<void> {
    await this.setWorkspace();
    await this.initialize();
  }
  private async createWorkspace(): Promise<void> {
    if (this.workspace !== defaultConfig.workspace) {
      await this.run(['workspace new', this.workspace], 'inherit');
    }
  }
  private async setWorkspace(): Promise<void> {
    process.chdir(this.workingDirectory);
    await this.createWorkspace();
    if (this.workingDirectory !== this.templateDirectory) {
      const command = `cp -a ${this.templateDirectory}/. ${this.workingDirectory}`;
      await execaCommand(command, {
        stdio: 'inherit'
      });
    }
  }
  private async initialize(): Promise<void> {
    const options = ['init'];
    if (!_.isEmpty(this.pluginDirectory)) {
      options.push(`-plugin-dir=${this.pluginDirectory}`);
    }
    await this.run(options, 'inherit');
  }
  async apply(): Promise<void> {
    const options = ['apply', '-auto-approve'];
    await this.run(options, 'inherit');
  }
  async destroy(): Promise<void> {
    const options = ['destroy', '-auto-approve'];
    await this.run(options, 'inherit');
  }
  async import(resourceName: string, resourceId: string): Promise<void> {
    const options = ['import', resourceName, resourceId];
    await this.run(options, 'inherit');
  }
  async output(): Promise<void> {
    const options = ['output', '-json'];
    const output = await this.run(options, 'pipe');
    return JSON.parse(output.stdout);
  }
  async getState(): Promise<void> {
    const options = ['show', '-json'];
    const state = await this.run(options, 'pipe');
    return JSON.parse(state.stdout);
  }
  async removeState(resourceName: string) {
    const options = ['state rm', resourceName];
    await this.run(options, 'inherit');
  }
  private async run(parameters: Array<string>, stdioHandler: StdioHandler): Promise<TerraformOutput> {
    await this.setup();
    const commandOpts = parameters.join(' ');
    const command = `terraform ${commandOpts}`;
    try {
      return await execaCommand(command, {
        stdio: stdioHandler,
        shell: true,
        env: {
          TF_INPUT: 'false',
          TF_LOG: _.defaultTo(process.env.TF_LOG, this.logLevel),
          TF_IN_AUTOMATION: 'true',
          TF_CLI_ARGS_import: '-no-color',
          TF_CLI_ARGS_apply: '-no-color',
          TF_CLI_ARGS_init: '-no-color',
          TF_CLI_ARGS_destroy: '-no-color'
        }
      });
    } catch (err) {
      console.log(`Failed to run command: ${command} with error: `, err);
      throw err;
    }
  }
}
