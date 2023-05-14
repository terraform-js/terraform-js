# terraform-js
A lightweight Javascript wrapper library for Terraform Cli written in Typescript

NPM package link: [terraform-js](https://www.npmjs.com/package/@terraform-js/terraform-js)

Install the package:

```
npm i @pnjha/terraform-js
```

Example:

```js
import { Terraformer } from "@terraform-js/terraform-js";

const config = {
  logLevel: 'INFO',         // supported values: TRACE, DEBUG, INFO, WARN or ERROR. Default is INFO
  workspace: 'default',     // workspace name if you want to create a new workspace. Default workspace is 'default'
  pluginDirectory: null,    // directory where you want to install terraform provider plugin
  templateDirectory: '.',   // directory where terraform templates are present
  workingDirectory: '.'     // directory where tf state file will be generated
}

const tf = new Terraformer(config);

tf.apply().then().catch((err)=>{
  console.log(err);
});

```

All contributions to this repo are welcomed in form of issues and PRs
