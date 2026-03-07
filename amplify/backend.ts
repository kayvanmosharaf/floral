import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js';

const backend = defineBackend({
  auth,
  data,
  storage,
});

// Enable USER_PASSWORD_AUTH flow on the Cognito app client
// (needed for the seed script to authenticate directly)
const { cfnUserPoolClient } = backend.auth.resources.cfnResources;
cfnUserPoolClient.explicitAuthFlows = [
  ...(cfnUserPoolClient.explicitAuthFlows as string[] || []),
  'ALLOW_USER_PASSWORD_AUTH',
];
