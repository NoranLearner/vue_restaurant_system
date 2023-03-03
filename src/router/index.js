import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUpView from '../views/SignUpView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import UpdateProfileView from '../views/UpdateProfileView.vue'
import AddNewLocation from '@/components/Locations/AddNewLocation.vue'
import DeleteLocation from '@/components/Locations/DeleteLocation.vue'
import DeleteAllLocation from '@/components/Locations/DeleteAllLocation.vue'
import UpdateLocation from '@/components/Locations/UpdateLocation.vue'
import Menu from '@/components/Menu/Menu.vue'
import ViewCategories from '@/components/Menu/ViewCategories.vue'
import AddNewCategory from '@/components/Menu/AddNewCategory.vue'
import UpdateCategory from '@/components/Menu/UpdateCategory.vue'
import DeleteCategory from '@/components/Menu/DeleteCategory.vue'
import DeleteAllCategories from '@/components/Menu/DeleteAllCategories.vue'
import AddNewItem from '@/components/Menu/AddNewItem.vue'
import UpdateItem from '@/components/Menu/UpdateItem.vue'
import ErrorPageView from '../views/ErrorPageView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: SignUpView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView
  },
  {
    path: '/update-profile',
    name: 'update-profile',
    component: UpdateProfileView
  },
  {
    path: '/add-new-location',
    name: 'add-new-location',
    component: AddNewLocation
  },
  {
    path: '/delete-location/:locationId',
    name: 'delete-location',
    component: DeleteLocation
  },
  {
    path: '/delete-all-locations',
    name: 'delete-all-locations',
    component: DeleteAllLocation
  },
  {
    path: '/update-location/:locationId',
    name: 'update-location',
    component: UpdateLocation
  },
  {
    path: '/menu/location/:locationId',
    name: 'menu',
    component: Menu
  },
  {
    path: '/menu/categories/view/:locationId',
    name: 'view-categories',
    component: ViewCategories
  },
  {
    path: '/menu/categories/add/:locationId',
    name: 'add-new-category',
    component: AddNewCategory
  },
  {
    path: '/menu/categories/update/:locationId/:catId',
    name: 'update-category',
    component: UpdateCategory
  },
  {
    path: '/menu/categories/delete/:locationId/:catId',
    name: 'delete-category',
    component: DeleteCategory
  },
  {
    path: '/menu/categories/delete-all/:locationId',
    name: 'delete-all-categories',
    component: DeleteAllCategories
  },
  {
    path: '/menu/items/add/:locationId',
    name: 'add-new-item',
    component: AddNewItem
  },
  {
    // http://localhost:8080/menu/items/update/3/1
    path: '/menu/items/update/:locationId/:itemId',
    name: 'update-item',
    component: UpdateItem
  },
  // Last Stays
  {
    path: '/:catchAll(.*)',
    name: 'errorPage',
    component: ErrorPageView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  // console.log(to);
  // console.log(from);
  // document.title = "Hello";
  // document.title = to.name;
  if (to.params.pageTitle !== undefined) {
    document.title = `${to.name} | ${to.params.pageTitle} | ${process.env.VUE_APP_TITLE}`;
  } else {
    if (to.name == null) {
      document.title = `Unknown Page | ${process.env.VUE_APP_TITLE}`;
    } else {
      document.title = `${to.name} | ${process.env.VUE_APP_TITLE}`;
    }
  }
  next();
});

export default router
