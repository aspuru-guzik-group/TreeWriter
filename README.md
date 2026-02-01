# TreeWriter: AI-Assisted Hierarchical Planning and Writing for Long-Form Documents

The source code for https://arxiv.org/abs/2601.12740

Online demo: You can create your own document and try out TreeWriter at https://treer.ai

Note: Arc browser may not work. Please use Chrome.

Related work: [TreeReader](https://ieeexplore.ieee.org/abstract/document/11303506) --- A tool that convert any paper into a tree

![img.png](img.png)

## Development

If you don't have `pnpm` installed, you can install it with:

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Install dependencies:

```bash
pnpm install
```

## Start server
Then, you can start the dev server with:

```bash
pnpm dev
```

Minimal MongoDB install (macOS Homebrew example):
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
```

to run mongodb (path depends on yourself)
```bash
mongod --dbpath /usr/local/var/mongodb
```
