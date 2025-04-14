import { createRouter, createWebHistory } from 'vue-router'


// const AdminsView = () => import('@/views/admins/admins/index.vue')
const UsersView = () => import('@/views/users/index.vue')
const HotelsView = () => import('@/views/hotels/hotels/index.vue')
const RoomsView = () => import('@/views/rooms/rooms/index.vue')
const RoomTypesView = () => import('@/views/roomtypes/roomTypes/index.vue')
const BookingsView = () => import('@/views/bookings/bookings/index.vue')
const PaymentView = () => import('@/views/payment/payment/index.vue')
const ReviewsView = () => import('@/views/reviews/reviews/index.vue')
const HotelOwnersView = () => import('@/views/hotelowners/hotelOwners/index.vue')
const RoomTypeInventoryView = () => import('@/views/roomtypeinventory/roomTypeInventory/index.vue')
const RegisterView = () => import('@/views/auth/RegistryView.vue')
const LoginView = () => import('@/views/auth/LoginView.vue')
const ForgotView = () => import('@/views/auth/ForgetView.vue')
const HomeView = () => import('@/views/home/HomeView.vue')
const AdminView = () => import('@/views/admins/admins/index.vue')
const OrdersSituation = () => import('@/views/users/components/OrdersSituation.vue')
const UsersForm = () => import('@/views/users/components/UsersForm.vue')
const SecurityForm = () => import('@/views/users/components/SecurityForm.vue')
const MyFavorites = () => import('@/views/users/components/MyFavorites.vue')
const MyNotifications = () => import('@/views/users/components/MyNotifications.vue')

const routes = [
  {
      path: "/",
      alias: ["/index", "/home"],
      name:"home",
      component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: '登录页面' }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { title: '注册页面' }
  },
  {
    path: '/forget',
    name: 'Forgot',
    component: ForgotView,
    meta: { title: '忘记密码页面' }
  },
  {
    path: '/user',
    name: 'UserHome',
    component: UsersView,
    meta: { title: '用户中心' },
    redirect: '/user/orders', // 默认重定向到订单页面
    children: [
      {
        path: 'orders',
        name: 'Orders',
        component: OrdersSituation,
        meta: { title: '我的订单' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: UsersForm,
        meta: { title: '个人信息' }
      },
      {
        path: 'security',
        name: 'Security',
        component: SecurityForm,
        meta: { title: '账号安全' }
      },
      {
        path: 'favorites',
        name: 'Favorites',
        component: MyFavorites,
        meta: { title: '我的收藏' }
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: MyNotifications,
        meta: { title: '我的通知' }
      }
    ]
  },
  {
    path: '/hotels/:id',
    name: 'Hotels',
    component: HotelsView,
    meta: { title: '酒店详情' }
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: RoomsView,
    meta: { title: '房间管理' }
  },
  {
    path: '/room-types',
    name: 'RoomTypes',
    component: RoomTypesView,
    meta: { title: '房型管理' }
  },
  {
    path: '/room-inventory',
    name: 'RoomInventory',
    component: RoomTypeInventoryView,
    meta: { title: '房间库存管理' }
  },
  {
    path: '/bookings',
    name: 'Bookings',
    component: BookingsView,
    meta: { title: '预订页面' }
  },
  {
    path: '/payments',
    name: 'myorder',
    component: PaymentView,
    meta: { title: '支付页面' }
  },
  {
    path: '/reviews/:bookingId',
    name: 'Reviews',
    component: ReviewsView,
    meta: { title: '评价页面' }
  },
  {
    path: '/hotel-owners',
    name: 'HotelOwners',
    component: HotelOwnersView,
    meta: { title: '酒店业主管理' }
  },
  {
    path: '/admins',
    name: 'Admins',
    component: AdminView,
    redirect: '/admins/home', 
    meta: { title: '管理端' },
    children: [
      {
        path: 'home', // 首页
        name: 'Home',
        meta: { title: '首页' },
        component: () => import('@/views/admins/admins/components/AdminsHome.vue')
      },{
        path: 'dashboard', // 统计-仪表盘
        name: 'Dashboard',
        meta: { title: '仪表盘' },
        component: () => import('@/views/admins/admins/components/AdminsDashboard.vue')
      },{
        path: 'sheet', // // 统计-报表
        name: 'AdmimSheet',
        meta: { title: '报表' },
        component: () => import('@/views/admins/admins/components/AdmimSheet.vue')
      },{
        path: 'order', // 管理-订单（支付流水、情况数据）
        name: 'OrderCtrl',
        meta: { title: '订单' },
        component: () => import('@/views/admins/admins/components/OrderCtrl.vue')
      },{
        path: 'reverse', // 管理-预订（接收、拒绝）
        name: 'ReverseCtrl',
        meta: { title: '预订' },
        component: () => import('@/views/admins/admins/components/ReverseCtrl.vue')
      },{
        path: 'rooms', // 管理-客房
        name: 'RoomsCtrl',
        meta: { title: '客房管理' },
        component: () => import('@/views/admins/admins/components/RoomsCtrl.vue')
      },
      {
        path: 'feedback', // 管理-酒店
        name: 'FeedBackCtrl',
        meta: { title: '评论管理' },
        component: () => import('@/views/admins/admins/components/FeedBackCtrl.vue')
      }

    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
