### DUKA FRONTEND

This a nextjs(App Router) project for a product catalog website. The main focus is of this frontend is to display products on the website and provide an admin interface to modify products.

## Tech stack

- Next.js 16.2.4 (App Router)
- React 19.2.4 + TypeScript
- Tailwind CSS v4 - Styling ui components
- TanStack React Query  - Client side data querying
- React Hook Form + Zod validation

## Requirements

- Node.js (recommend Node 20+)
- pnpm ()

## Set Up

### 1) Configure URL in .env
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 2) Install dependencies

- pnpm install

### 3) Run Development Server

- pnpm run dev
- App runs on:http://localhost:3000

### Routes

  - / — featured products
  - /products - product listing (supports ?category=`<slug`>&page=`<n>`)
  - /product/[slug] - List product and reviews
  - /categories - categories listing
  - /categories/[slug] - Lists category and its products
  - /login - admin login
  - /admin - admin products table
  - /admin/reviews - admin reviews moderation


## Querying Data

We use two different strategies here. These are technical decisions based on how nextjs works.

- We have `client_fetch` function that utilizes browser api to access stored access tokens. `app/lib/client_fetch.ts`

- We also have `apiFetch` which works on the server side to make calls to the api. This includes revalidation at the fetch level set for categories. It can be broadened to be used to access servver side apis. `app/lib/utils.ts`

These two reserve a globalised api response that is the same structure everywhere.

```ts
export type ApiResponse<T> = {
  message: string
  data: T
  meta?: PaginationMeta
  links?: Record<string, any>
  errors?: Record<string, any[]>
}
```

### 1. React Query
I have added react query which powers the `useReviews` and `useProducts` on top of the fetch lib functions in `app/lib/api`.

This allows data fetching in a more robust way to handle request and also has a provider we can use to handle errors globally as done in `ReactQueryProvider` where I handle in a minimal way some global errors.

> we can improve the error handling to redirect etc on the client side but for now I just show a toast message.

### 2. Optimistic updates.
With querying data comes the behaviour that is expected, I have opted to share the three ways I can do optimistic updates.

#### a) Use of toasts
I have integrated `sonner` to be used to show toast updates on success. This has allowed on sucess, on error messages to be shared and flushed away.

#### b) mutations.
React query provides for mutation function that can help set data while the request runs in the background. While this may have pitfalls, I have shared an example in `useProduct` hook for the `togglePublish` functions. This does in place updates.

#### c) onSuccess appends.
We can decide to invalidate cache in react query but a good way is when we perform a update/create function, we use react query to append the new item into the list on success without having to call the api. This can be shown in the `saveProduct` function.

> This are some of the technical decisions I made on this level of the application that involve querying data.

## UI

I have used shadcn before and I decided to borrow from that some of the principles I made to design a simple ui library. It follows a simple principle of keeping logic out of UI.

The **dark mode and light mode** also are inspired by this to make it as customizable as possible in `gloabal.css` using tailwind`s theme.

I made a few components that I used in the `components/ui` path that provides an idea into building ui components.

>These are not production grade components, as we could improve for example the `table` component to be more robust by breaking it into more parts, provide more variants to buttons etc

## AUTH

I used browser cookies to setup a simple auth. It stores an auth token. Since the auth interacts with only client side code, I essentially developed an `AuthGuard` that i put it in the layout for admin pages. Another way would be using an AuthProvider that handles the auth. 

It simply checks whether one is authenticated to access the admin side of the application.

## Nextjs

> very nice framework.

For **SSG**, **SSR**, **CSR** and **ISR** might be where I spent most of the time. Some of the conecepts I have picked up include:

- awaiting params(headache for a while)
- directives are not meant to be put on every page
- client side fetch and server side fetch may use different apis that are not available on both
- It advises on ttl decsions based on what you chose depending on business decisions, data volatility and perf trade offs(very fast for SSG + ISR - instant page loads)
The decisions for SSG is mostly advised by how often the data changes. The caching strategy is discussed in the backend readme whenre I explain what are the variables that make up caching stratgies. 

For example for products, I ended up with  a more dynamic page due to its changes that depend on url params which are dynamic.
The featured section is forced static and remains unchanged till the next build.
Category will have revalidation every 5min since they are not volatile.




