import Index from './components/basic/Index'


export default {
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index,
            meta: {
                keepAlive: true
            }
        }
    
    ],
    scrollBehavior(to, from, savedPosition) {
        if (from.name === 'index') {
            from.meta.savedPosition = document.body.scrollTop;
        }
        if (savedPosition) {
            return savedPosition
        } else {
            return {
                x: 0,
                y: to.meta.savedPosition || 0
            }
        }
    }
}