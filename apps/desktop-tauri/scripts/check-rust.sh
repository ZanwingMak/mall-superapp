#!/usr/bin/env bash
set -euo pipefail

if ! command -v rustc >/dev/null 2>&1; then
  echo "[desktop-tauri] rustc not found. Install Rust: https://rustup.rs"
  exit 1
fi
if ! command -v cargo >/dev/null 2>&1; then
  echo "[desktop-tauri] cargo not found. Install Rust: https://rustup.rs"
  exit 1
fi

rustc --version
cargo --version
echo "[desktop-tauri] Rust toolchain check passed"
