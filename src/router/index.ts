import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      guest: true,
      title: "Login",
    },
  },
  {
    path: "/media",
    name: "MediaList",
    component: () => import("../views/MediaList.vue"),
    meta: {
      withAuth: true,
      title: "Media Dashboard",
    },
  },
  {
    path: "/media/add",
    name: "MediaAdd",
    component: () => import("../views/MediaAdd.vue"),
    meta: {
      withAuth: true,
      title: "Add New Media",
    },
  },
  {
    path: "/media/edit/:mediaID",
    name: "MediaEdit",
    component: () => import("../views/MediaEdit.vue"),
    meta: {
      withAuth: true,
      title: "Edit Media",
    },
  },
  {
    path: "/media/balance/edit/:mediaID",
    name: "BalanceEdit",
    component: () => import("../views/BalanceEdit.vue"),
    meta: {
      withAuth: true,
      title: "Edit Balance",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.withAuth)) {
    if (localStorage.getItem("token") == null) {
      next({
        path: "/",
        params: { nextUrl: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
