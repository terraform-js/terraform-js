import { Terraformer } from '@pnjha/terraform-js';

async function createVPC() {
  const terraform = new Terraformer({});
  await terraform.plan();
  await terraform.apply();
  await terraform.destroy();
}

createVPC();
