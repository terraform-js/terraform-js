import { Terraformer } from '@terraform-js/terraform-js';

async function createVPC() {
  const terraform = new Terraformer({});
  await terraform.plan();
  await terraform.apply();
  await terraform.destroy();
}

createVPC();
