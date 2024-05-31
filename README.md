# Conway's Game of Live

![thumbnail](./public/thumbnail.png)

## Quick Start

```console
$ npm i
$ npm run dev
```

## Change implementation to AssemblyScript

- Run `npm run build asbuild`
- Open `src/main.ts`
- Change `const IMPL: TImpl = "ts";` to `const IMPL: TImpl = "asm-ts";`
- Run `npm run dev` or it will automatically reload if it's already done
