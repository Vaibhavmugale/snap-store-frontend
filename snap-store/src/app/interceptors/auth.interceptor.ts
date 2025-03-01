import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwtToken');

  if (token) {
    const clonedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    console.log('AuthInterceptor: Adding Authorization header');
    return next(clonedReq);
  }

  console.warn('AuthInterceptor: No token found');
  return next(req);
};
