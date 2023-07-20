import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  config: "tsconfig.json",
  outDir: "dist",
  format: ["cjs", "esm"],
  sourcemap: true,
  clean: true,
  dts: true,
});
