import { createStart } from '@tanstack/react-start'
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const startInstance = createStart(async () => ({
  createRouter: () => import('./router').then(m => m.getRouter()),
  beforeStart: () => {
    // Any setup code here
  },
  context: () => ({
    queryClient,
  }),
}))
