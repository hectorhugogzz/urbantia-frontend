---

###  `QUICKSTART-FIREBASE.md` (For Multi-Project Setups)

This guide explains how to connect a frontend application in a **Service Project** to an Identity Platform instance running in a central **SSO Project**.

**Your Projects:**
*   **SSO Project:** `prj-sie-pla-sso-prod` (Where users live)
*   **Service Project:** `prj-sie-cor-salesauto-prod` (Where your app runs)

---

### 1. Authorize Your Application's Domain

First, you must tell the SSO project that it is allowed to accept authentication requests from your application.

1.  Open the [Firebase Console](https://console.firebase.google.com/) and select your **SSO Project** (`prj-sie-pla-sso-prod`).
2.  In the left-hand menu, go to *Buuild --> *Authentication**.
3.  Click on the **Settings** tab.
4.  Select the **Authorized domains** sub-tab.
5.  Click **Add domain**.
6.  You need to add the domain where your Cloud Run app will be hosted. You can find this URL in the Cloud Run console for your `sales-agent-frontend-prod` service. It will look like: `sales-agent-frontend-prod-xxxx-uc.a.run.app`.
7.  For local testing, `localhost` should already be on the list by default. If not, add it.

### 2. Get Firebase Credentials (From the SSO Project)

This is the most critical step. You must get the configuration from the project that holds the users.

1.  In the [Firebase Console](https://console.firebase.google.com/), ensure you are still in your **SSO Project** (`prj-sie-pla-sso-prod`).
2.  Click the **Gear icon** ⚙️ (top-left) and select **Project settings**.
3.  Under the **General** tab, scroll down to "Your apps".
4.  If you haven't already, create a **Web App (`</>`)** in this SSO project. This app registration is just to generate the configuration keys; it does not need to be hosted. Give it a name like "Sales Agent Authenticator".
5.  Find the app in the list and select **Config** for the **SDK setup and configuration**.
6.  You will see the `firebaseConfig` object. **These are the keys you must use.**

    ```javascript
    // These keys come from prj-sie-pla-sso-prod
    const firebaseConfig = {
      apiKey: "AIzaSy...your-sso-project-key",
      authDomain: "prj-sie-pla-sso-prod.firebaseapp.com",
      projectId: "prj-sie-pla-sso-prod",
      // ...and so on
    };
    ```

### 2a. Find Your Tenant ID (From the SSO Project)

To ensure users are authenticated against the correct tenant within your Identity Platform, you need the Tenant ID.

1.  In the **Google Cloud Console**, make sure you are in your **SSO Project** (`prj-sie-pla-sso-prod`).
2.  Navigate to **Identity Platform -> Tenants**.
3.  You should see a tenant that has been configured for the Sales Automation system. Copy its **Tenant ID** (it will look something like `tenant-id-xxxx`). This is a critical value.


### 3. Configure and Run Locally

Now, use the keys from the **SSO project** to configure your local environment. The `deploy/env/` directory is the source of truth for all environment variables for your deployed application. The `dev.json` file is for your local development environment, while `prod.json` is for the production deployment.

1.  Navigate to your frontend code directory:
    ```bash
    cd sales-agent-frontend/
    ```
2.  Open the `deploy/env/dev.json` file.
3.  Fill in the `envVars` section using the values you just copied from the **`prj-sie-pla-sso-prod`** Firebase console and the Tenant ID.

    ```json
    // sales-agent-frontend/deploy/env/dev.json
    {
      "cloudRunConfig": {
        "serviceName": "sales-agent-frontend-dev",
        "targetProject": "sales-agent-frontend-prod", // <-- App's Project
        "region": "us-central1",
        "serviceAccount": "...", // <-- App's SA
        // ...
      },
      "envVars": {
        "NEXT_PUBLIC_FIREBASE_API_KEY": "KEY_FROM_SSO_PROJECT",
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "DOMAIN_FROM_SSO_PROJECT",
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "prj-sie-pla-sso-prod", // <-- SSO Project ID
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "BUCKET_FROM_SSO_PROJECT",
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "SENDER_ID_FROM_SSO_PROJECT",
        "NEXT_PUBLIC_FIREBASE_APP_ID": "APP_ID_FROM_SSO_PROJECT",
        "NEXT_PUBLIC_FIREBASE_TENANT_ID": "YOUR_TENANT_ID_FROM_STEP_2A"
      }
    }
    ```

4.  Navigate into the `app` directory and run the local development server. This will use our helper script to generate the correct `.env.local` from your `dev.json`.
    ```bash
    cd app
    npm run dev
    ```

### 4. Test with an Identity Platform User

1.  In the **Google Cloud Console**, go to your **SSO Project** (`prj-sie-pla-sso-prod`).
2.  Navigate to **Identity Platform -> Users**.
3.  Create a test user here if you haven't already.
4.  Use these user credentials to log in to your application running on `localhost:3000`.

It should now work. The `auth/invalid-api-key` error will be resolved because your application is finally presenting the correct API key to the correct Identity Platform instance.
