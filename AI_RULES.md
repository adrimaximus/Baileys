# AI Development Rules for Baileys

This document outlines the technical stack and development rules for the Baileys library. Adhering to these guidelines ensures consistency, maintainability, and high-quality code.

## Tech Stack

Baileys is a TypeScript library for interacting with the WhatsApp Web API. Its core technologies are:

- **Language**: The entire codebase is written in **TypeScript**, ensuring type safety and better maintainability.
- **Runtime**: The library is designed to run on **Node.js** (version 20.x or higher is required).
- **Package Manager**: Project dependencies are managed with **Yarn 4.x**.
- **Core Communication**: Interacts directly with WhatsApp's servers via **WebSockets**, without requiring a browser instance.
- **Protocol Handling**: Uses **protobufjs** to encode and decode messages based on the definitions in `WAProto/WAProto.proto`.
- **Cryptography**: End-to-end encryption is handled by a fork of **libsignal-protocol-javascript**, along with custom crypto utilities in `src/Utils/crypto.ts`.
- **Linting & Formatting**: Code consistency is maintained with **ESLint** and **Prettier**.
- **Testing**: The project uses **Jest** for unit and end-to-end testing.
- **CI/CD**: **GitHub Actions** are used for automated building, linting, testing, and publishing new releases to npm.

## Development Guidelines & Library Usage

To maintain a clean and consistent codebase, please follow these rules:

### 1. Code Style & Quality

- **Adherence**: Strictly follow the coding style defined by the project's ESLint and Prettier configurations.
- **Formatting**: Before committing any changes, run `yarn format` and `yarn lint:fix` to ensure your code is clean and consistent.
- **Typing**: Leverage TypeScript's features to write strongly-typed, self-documenting code. Update or add types in the `src/Types` directory as needed.

### 2. Protocol & Communication

- **Protocol Definitions**: Do not manually edit the generated protobuf files. If the WhatsApp protocol changes, use the scripts in `proto-extract/` to generate a new `WAProto.proto` file.
- **WebSocket Logic**: All direct WebSocket communication is managed by the core socket files. Use the provided abstractions (`sendNode`, `query`, etc.) for interacting with the socket.

### 3. Cryptography

- **Use Existing Utilities**: For all encryption and decryption tasks, use the established wrappers around `libsignal` and the helper functions in `src/Signal/` and `src/Utils/crypto.ts`. Avoid introducing new cryptography libraries.

### 4. Dependencies

- **Package Management**: Use `yarn add` to include new dependencies. Ensure you are using Yarn 4.x as specified in the project configuration.
- **Third-Party Libraries**: Only add new third-party libraries if they provide essential functionality that cannot be reasonably built from scratch or by using existing dependencies.

### 5. Error Handling & Logging

- **Error Objects**: Use the `@hapi/boom` library to create detailed, HTTP-friendly error objects.
- **Logging**: Utilize the existing `pino` logger instance for all logging. Provide clear, contextual information in your log messages to aid in debugging.

### 6. Testing

- **Unit Tests**: All new features or significant bug fixes must be accompanied by unit tests. Place test files (`.test.ts`) alongside the source files they are testing.
- **End-to-End Tests**: For features that involve direct interaction with the WhatsApp API, consider adding end-to-end tests in the `src/__tests__/e2e/` directory.

### 7. Commits and Pull Requests

- **Commit Messages**: Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g., `feat:`, `fix:`, `chore:`, `docs:`). This helps in automating changelog generation.
- **Pull Requests**: Ensure your PRs are focused on a single feature or fix. Write a clear and descriptive title and body explaining the changes and the reasoning behind them.