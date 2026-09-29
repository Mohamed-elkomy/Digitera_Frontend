import {defineCliConfig} from 'sanity/cli'
import {PROJECT_ID, DATASET} from './project'

export default defineCliConfig({
  api: {projectId: PROJECT_ID, dataset: DATASET},
  // The dashboard's public address: https://odoratus-dashboard.sanity.studio
  // (change it here if that name is taken when you run `pnpm deploy-dashboard`).
  studioHost: 'odoratus-dashboard',
  deployment: {autoUpdates: true},
})
