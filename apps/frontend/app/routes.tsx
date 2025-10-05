import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('./routes/index.tsx'),
  route('signin', './routes/signin.tsx'),
  route('signup', './routes/signup.tsx'),
  route('app', './routes/app-page.tsx'),
] satisfies RouteConfig;
