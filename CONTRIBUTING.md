# Contributing to State-Chats

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## We Use GitHub Flow

We follow [GitHub Flow](https://docs.github.com/get-started/quickstart/github-flow), a lightweight, branch-based workflow that supports collaboration and quality coding. Please ensure you are familiar with this workflow when contributing.

## Automated Versioning and Publishing

Our repository uses GitHub Actions for Continuous Integration. When a PR is merged into the main branch, semantic versioning checks are applied to commit messages (chore/fix/feat), and new versions are automatically published to npm.

## Semantic Versioning and Commit Messages

For automated semantic versioning, we follow a specific format for commit messages. This ensures that our versioning system correctly interprets changes and updates the package version accordingly. Here is a guide for commit message format:

- `feat`: A new feature (corresponds to MINOR in semantic versioning).
- `fix`: A bug fix (corresponds to PATCH in semantic versioning).
- `chore`: Maintenance and chores that don't modify src or test files.
- `docs`: Documentation changes and updates.
- `style`: Code style changes (formatting, missing semi colons, etc; no code change).
- `refactor`: Refactoring code without changing public API.
- `test`: Adding or updating tests (no production code change).

Please make sure your commit messages clearly reflect the purpose and nature of your changes, following these conventions.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](LICENSE) that covers the project.

## Report bugs using Github's [issues](https://github.com/nt9142/state-chats/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/nt9142/state-chats/issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People _love_ thorough bug reports.

## Use a Consistent Coding Style

- 2 spaces for indentation rather than tabs
- You can try running `npm run lint` for style unification

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## References

This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/master/CONTRIBUTING.md)
