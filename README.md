# Facets Cloud Docker Image Register Action

This GitHub Action automates the registration of Docker images with the Facets Cloud control plane using the `@facets-cloud/facetsctl` CLI. This action is ideal for workflows that require registering images that are already pushed to a Docker registry into the Facets platform, supporting automated deployments with detailed configurations.

## Features

- **Easy Authentication**: Automates authentication using your provided credentials to ensure secure interactions with the Facets Cloud.
- **Git Reference Integration**: Includes support to automatically detect the current Git reference, facilitating accurate version tracking and deployment records.
- **Flexible Configuration**: Offers various options to customize the registration process, accommodating different deployment requirements and environments.

## Prerequisites

To use this action, you need:
- A Docker image that has already been pushed to a registry.
- Credentials for accessing the Facets Cloud platform.

## Inputs

| Name                  | Description                                                         | Required |
|-----------------------|---------------------------------------------------------------------|----------|
| `username`            | Facets Cloud username for authentication.                           | Yes      |
| `token`               | Facets Cloud access token for authentication.                       | Yes      |
| `cp-url`              | URL to the Facets Cloud control plane.                              | Yes      |
| `docker-image`        | Full name and tag of the Docker image.                              | Yes      |
| `service`             | Name of the service for which the artifact needs to be registered.  | Yes      |
| `external-id`         | External identifier for the artifact.                               | Yes      |
| `git-ref`             | Git reference for the artifact.                                     | Conditional |
| `autodetect-git-ref`  | Auto-detect the current Git branch or tag.                          | No       |
| `description`         | Description of the build, if any.                                   | No       |
| `registry`            | Registry location where the image is stored.                        | No       |
| `blueprint-name`      | Blueprint name for setting up the CI integration.                   | No       |
| `debug`               | Enables debugging mode to see detailed error messages.              | No       |
| `registration-type`   | Mode of registration (e.g., ENVIRONMENT, RELEASE_STREAM).           | No       |

## Outputs

No outputs are defined for this action.

## Example Usage

```yaml
name: Register Docker Image to Facets Cloud
on:
  push:
    branches:
      - main

jobs:
  register:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Register Docker Image to Facets Cloud
        uses: ./.github/actions/facets-cloud-register
        with:
          username: ${{ secrets.FACETS_USERNAME }}
          token: ${{ secrets.FACETS_TOKEN }}
          cp-url: "https://api.facets.cloud"
          docker-image: "myrepo/myapp:latest"
          service: "myapp-service"
          external-id: "app-external-id"
          autodetect-git-ref: "true"
          description: "Latest deployment of myapp"
          registry: "docker.io"
          debug: "true"
```

## Debugging and Troubleshooting

If you encounter issues during the execution of this action, ensure:
- All required inputs are correctly provided.
- The Facets Cloud control plane URL is accessible.
- The provided credentials are valid and have sufficient permissions.

Enable the `debug` flag for detailed error outputs to troubleshoot issues effectively.

## Support

For additional help or information about the Facets Cloud platform, please refer to the official documentation at [Facets Cloud Documentation](https://www.facets.cloud/docs) or contact support.
