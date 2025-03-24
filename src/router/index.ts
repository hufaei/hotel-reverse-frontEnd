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
    path: '/forgot',
    name: 'Forgot',
    component: ForgotView,
    meta: { title: '忘记密码页面' }
  },
  {
    path: '/user',
    name: 'User',
    component: UsersView,
    meta: { title: '用户首页' }
  },
  {
    path: '/hotels',
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
    name: 'Payments',
    component: PaymentView,
    meta: { title: '支付页面' }
  },
  {
    path: '/reviews',
    name: 'Reviews',
    component: ReviewsView,
    meta: { title: '评价页面' }
  },
  {
    path: '/hotel-owners',
    name: 'HotelOwners',
    component: HotelOwnersView,
    meta: { title: '酒店业主管理' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
