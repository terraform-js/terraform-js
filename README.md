# terraform-js
A lightweight Javascript wrapper library for Terraform Cli written in Typescript

NPM package link: https://www.npmjs.com/package/@pnjha/terraform-js

Install the package:

```
npm i @pnjha/terraform-js
```

Example:

```js
import { Terraformer } from "@pnjha/terraform-js";

const config = {
  logLevel: 'INFO',         // supported values: TRACE, DEBUG, INFO, WARN or ERROR. Default is INFO
  workspace: 'default',     // workspace name if you want to create a new workspace. Default workspace is 'default'
  pluginDirectory: null,    // directory where you want to install terraform provider plugin
  templateDirectory: '.',   // directory where terraform templates are present
  workingDirectory: '.'     // directory where tf state file will be generated
}

const tf = new Terraformer({});

await tf.apply();

```

All contributions to this repo are welcomed in form of issues and PRs
