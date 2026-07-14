This is a [Next.js](https://nextjs.org/) project bootstrapped with [`c3`](https://developers.cloudflare.com/pages/get-started/c3).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Connecting a fresh clone to the live deployment

This project is **already deployed** to a Cloudflare Pages project named `peterrhodestribute` (live at https://peterrhodestribute.com). The Pages project is **not** connected to GitHub — there is no auto-deploy on push. Every production release happens manually from a developer machine via `pnpm deploy`. If you've just cloned this repo and need to push a new version, follow the steps below.

> If you're standing up a brand-new deployment from scratch (different Cloudflare account, fresh D1 and R2), follow `setup-instructions.md` instead — it covers creating new resources. The steps below assume you want to deploy to the **existing** infrastructure.

### 1. Get access to the Cloudflare account

The project lives in the Cloudflare account associated with `m.mirghorbani@gmail.com`. You need to be added as a member with at least Pages, D1, and R2 write access before any of the following will work.

### 2. Install and authenticate

```bash
pnpm install
npx wrangler login      # opens a browser — log in as a member of the account above
npx wrangler whoami     # confirm the right account is selected
```

If you have multiple Cloudflare accounts, Wrangler will prompt you to pick one on the first deploy — make sure to pick the one that owns this project.

### 3. Confirm the existing resources are visible to you

The `wrangler.jsonc` already references the production D1 database (`tribute-db`, id `0d802835-d429-4883-b417-2ad372744f9d`) and R2 bucket (`tribute-images`). Verify you can see them:

```bash
npx wrangler pages project list | grep peterrhodestribute
npx wrangler d1 list            | grep tribute-db
npx wrangler r2 bucket list     | grep tribute-images
```

**Do not** run `wrangler d1 create` or change the `database_id` in `wrangler.jsonc` — that would orphan the live data. Same for the R2 bucket name.

### 4. Runtime secrets (already set in production)

The app reads one secret at runtime. It's already configured on the deployed project — you don't need to set it to deploy, only to rotate it.

| Secret | Read at | Purpose |
|---|---|---|
| `TRIBUTE_ADMIN_PASSWORD_HASH` | `src/app/api/auth/login/route.ts` | bcrypt hash of the admin password |

To inspect or rotate:

```bash
npx wrangler pages secret list --project-name=peterrhodestribute
npx wrangler pages secret put  TRIBUTE_ADMIN_PASSWORD_HASH --project-name=peterrhodestribute
```

> **Heads up — orphan secrets.** The Pages project also has `ADMIN_EMAIL`, `FROM_EMAIL`, and `RESEND_API_KEY` configured, but the current code does not read them — admin notification emails send via the Cloudflare `SEND_EMAIL` binding (`wrangler.jsonc`), not Resend. Admin recipient and sender addresses are hardcoded in `src/app/utils/email.ts` (constants `ADMIN_NOTIFICATION_EMAILS` and `SENDER_EMAIL_ADDRESS`). If you want to change who receives notification emails, edit those constants (and the `allowed_destination_addresses` list in `wrangler.jsonc` — each recipient must be a verified Cloudflare Email Routing destination) and redeploy.

### 5. Deploy

```bash
pnpm deploy
```

This runs `next-on-pages` to produce the build output, then `wrangler pages deploy` to upload it to the `peterrhodestribute` Pages project as a production deployment.

To verify the deploy landed, check the deployment list:

```bash
npx wrangler pages deployment list --project-name=peterrhodestribute | head -5
```

The newest row should show the commit you just deployed.

## Cloudflare integration

Besides the `dev` script mentioned above `c3` has added a few extra scripts that allow you to integrate the application with the [Cloudflare Pages](https://pages.cloudflare.com/) environment, these are:
  - `pages:build` to build the application for Pages using the [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages) CLI
  - `preview` to locally preview your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI
  - `deploy` to deploy your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI

> __Note:__ while the `dev` script is optimal for local development you should preview your Pages application as well (periodically or before deployments) in order to make sure that it can properly work in the Pages environment (for more details see the [`@cloudflare/next-on-pages` recommended workflow](https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md#recommended-development-workflow))

### Bindings

Cloudflare [Bindings](https://developers.cloudflare.com/pages/functions/bindings/) are what allows you to interact with resources available in the Cloudflare Platform.

You can use bindings during development, when previewing locally your application and of course in the deployed application:

- To use bindings in dev mode you need to define them in the `next.config.js` file under `setupDevBindings`, this mode uses the `next-dev` `@cloudflare/next-on-pages` submodule. For more details see its [documentation](https://github.com/cloudflare/next-on-pages/blob/05b6256/internal-packages/next-dev/README.md).

- To use bindings in the preview mode you need to add them to the `pages:preview` script accordingly to the `wrangler pages dev` command. For more details see its [documentation](https://developers.cloudflare.com/workers/wrangler/commands/#dev-1) or the [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

- To use bindings in the deployed application you will need to configure them in the Cloudflare [dashboard](https://dash.cloudflare.com/). For more details see the  [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

#### KV Example

`c3` has added for you an example showing how you can use a KV binding.

In order to enable the example:
- Search for javascript/typescript lines containing the following comment:
  ```ts
  // KV Example:
  ```
  and uncomment the commented lines below it (also uncomment the relevant imports).
- In the `wrangler.jsonc` file add the following configuration line:
  ```
  "kv_namespaces": [{ "binding": "MY_KV_NAMESPACE", "id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }],
  ```
- If you're using TypeScript run the `cf-typegen` script to update the `env.d.ts` file:
  ```bash
  npm run cf-typegen
  # or
  yarn cf-typegen
  # or
  pnpm cf-typegen
  # or
  bun cf-typegen
  ```

After doing this you can run the `dev` or `preview` script and visit the `/api/hello` route to see the example in action.

Finally, if you also want to see the example work in the deployed application make sure to add a `MY_KV_NAMESPACE` binding to your Pages application in its [dashboard kv bindings settings section](https://dash.cloudflare.com/?to=/:account/pages/view/:pages-project/settings/functions#kv_namespace_bindings_section). After having configured it make sure to re-deploy your application.
