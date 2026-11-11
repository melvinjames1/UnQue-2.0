# Deployment

The GitHub Actions workflow runs checks for pull requests and pushes to `main`. A successful push to `main` is deployed to EC2 over SSH.

## GitHub environment

Create a GitHub environment named `production` and add these environment secrets:

| Secret | Value |
| --- | --- |
| `EC2_HOST` | EC2 public DNS name or IP address |
| `EC2_USER` | SSH user on the instance |
| `EC2_SSH_KEY` | Private SSH key for that user |
| `EC2_KNOWN_HOSTS` | Verified SSH host-key entry for the instance |
| `EC2_APP_DIR` | Existing absolute application directory on the instance |

Protect the `production` environment with any required reviewers or branch restrictions. The SSH public key must be authorized for `EC2_USER` on the instance. Use a runner with network access to the instance; for GitHub-hosted runners, account for their changing IP ranges when configuring SSH ingress.

## EC2 setup

Install Node.js 20, npm, rsync, and PM2 on the instance. Create `EC2_APP_DIR`, ensure `EC2_USER` can write to it and run PM2, and create the runtime `.env` file there before the first deployment. The process is started or reloaded under the PM2 name `unque`.

The workflow deliberately excludes `.env` from synchronization and does not store application or database credentials in GitHub. Keep the instance's environment file and DocumentDB CA bundle outside the deployed source tree where possible.

## Amazon DocumentDB

Configure the instance's `.env` with a `MONGO_URL` that uses the DocumentDB cluster endpoint, TLS, and the CA bundle installed on the instance. A typical URI is:

```text
mongodb://<username>:<password>@<cluster-endpoint>:27017/?tls=true&tlsCAFile=/path/to/global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false
```

URL-encode special characters in the username and password. Allow inbound TCP port 27017 on the DocumentDB security group from the EC2 instance's security group, and keep SSH ingress restricted to a trusted runner or network.
