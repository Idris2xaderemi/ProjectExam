export const testPages = [
  {
    label: 'Error Boundary',
    path: '/trigger-error',
    testError: true
  },
  {
    label: 'Custom 404',
    path: '/non-existent-page',
    testError: false
  }
]