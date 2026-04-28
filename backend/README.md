### DUKA BACKEND

This a laravel application that provides a **REST** api to Duka frontend. It handles authentication, authorization(surface level not policies or roles)

## Tech stack

- PHP 8.4+
- Laravel 12 + (Laravel 13 is too new for me at the moment but will catchup soon)
- Pest 3+(prefer this to phpuinit - I can use both)
- redis


## Requirements

- PHP 8.4+
- Composer 2.9.5
- redis
- Enabled extensions for php(pdo_psql, php-redis  etc)

## Set Up

### 1) Configure URL in .env

#### set up database
```
cd backend
composer install
cp .env.example .env

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=wfd
DB_USERNAME=root
DB_PASSWORD=password
```
#### setup cache store
```
CACHE_STORE=redis
```

### 2) Start the backend
  ```bash
  php artisan key:generate
  php artisan migrate
  php artisan db:seed
  php artisan serve 
```

The seeded admin user is 

```
email: testuser@example.com
password: password
```

You can login at the `/login` route but if you try to access login you will be redirectd.
## Scripts

> Note: Before running tests refer to `phpunit.xml` I used a wfd_test database in testing but those values can be changed to something you. You can opt for sqlite etc.

```
php artisan test
composer pint
```

### API

  ### Auth

  - POST /api/v1/auth/login
  - POST /api/v1/auth/logout (auth)
  - GET /api/v1/auth/me (auth)

  ### Public

  - GET /api/v1/products (published-only list; supports page and category query params)
  - GET /api/v1/products/{product} (slug route key)
  - GET /api/v1/categories
  - GET /api/v1/categories/{category} (slug route key)
  - POST /api/v1/reviews (rate-limited: throttle:5,1)

  ### Admin (Sanctum token auth)
  - GET/POST/PATCH/DELETE /api/v1/admin/products
  - GET/PATCH/DELETE /api/v1/admin/reviews

## Technical Decisions

### Macros

I used a macro in `AppServiceProvider` to build a standardised api respponse body. This allows me to achieve a unified api response that is the same. 

With this macro, i also changed the format and structure of errors by `FormRequests` by building a BaseRequest that returns 422 errors in the standard format.

I also updated the errors default error messages to exceptions for 404 and 401 to follow the same standard format.

### Services

I opted for services in order to support controllers in a uniform way. For example I have `ProductController` and `AdminProdductController` which would basically fit in one controller.

To  ensure that I follow DRY principles, I added a service layer to handle logic related tasks while the controller focuses on request and response ensuring that validations etc remain consistent.

### Caching
What advises Caching strategy is data volatility,performance, business , freshness etc.

- For categories(list section), I opted for remember forever since its unchanging and the frontend is static.

- For categories(show), I opted for 5 mins since the products under a category do not change that often.

- For products(list), I opted for 1 min since the frontend revalidates and is the most volatile of the given data.(Also important since it provides pricing information etc)

- For Products(show), I also opted for the same 1 min since there is revalidation after 60s and its also volatile.

These are how I came up with the ttls.

### Actions

> Think you need another method? You really need another controller. Built *all* of Vapor like this. - [Taylor Otwell](https://x.com/taylorotwell/status/1651593413140287488)

I decided to stick to the main functions of a controller instead of having actions for things like `publish`, `toggle` etc. This is because I always feel the same way, with form request and the patch method, alot of this functions just do updates. This is a strategy I follow but would love to hear counter arguments to it.


