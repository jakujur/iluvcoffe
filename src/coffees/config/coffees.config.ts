import { registerAs } from '@nestjs/config';

//optional: injecting service configurations
export default registerAs('coffees', () => ({
  foo: 'bar',
}));
