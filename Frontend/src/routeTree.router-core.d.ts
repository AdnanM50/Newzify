declare module '@tanstack/router-core' {
  interface FileRoutesByPath {
    '/blog': {
      id: '/blog'
      path: '/blog'
      fullPath: '/blog'
      preLoaderRoute: any
      parentRoute: any
    }
    '/blog/$blogId': {
      id: '/blog/$blogId'
      path: '/blog/$blogId'
      fullPath: '/blog/$blogId'
      preLoaderRoute: any
      parentRoute: any
    }
    '/reporter-dashboard/blog/create': {
      id: '/reporter-dashboard/blog/create'
      path: '/reporter-dashboard/blog/create'
      fullPath: '/reporter-dashboard/blog/create'
      preLoaderRoute: any
      parentRoute: any
    }
  }
}
