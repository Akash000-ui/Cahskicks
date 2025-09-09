import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent)
    },
    {
        path: 'demo',
        loadComponent: () => import('./pages/component-demo/component-demo.component').then(m => m.ComponentDemoComponent)
    },
    {
        path: 'accelerate',
        loadComponent: () => import('./pages/cash-acceleration-page/cash-acceleration-page.component').then(m => m.CashAccelerationPageComponent)
    },
    {
        path: 'cash-acceleration',
        loadComponent: () => import('./pages/cash-acceleration-page/cash-acceleration-page.component').then(m => m.CashAccelerationPageComponent)
    },
    {
        path: 'create',
        loadComponent: () => import('./pages/create-cashkick-page/create-cashkick-page.component').then(m => m.CreateCashkickPageComponent)
    },
    {
        path: '**',
        redirectTo: '/home'
    }
];
