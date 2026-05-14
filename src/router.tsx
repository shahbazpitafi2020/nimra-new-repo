import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function getRouter() {
  return createRouter({
    routeTree,
    context: {
      queryClient,
    },
  })
}
