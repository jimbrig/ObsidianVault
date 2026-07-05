---
creation_date: 2026-06-15
modification_date: 2026-06-15T18:13:25-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Rust on Windows
tags:
  - Type/Guide
  - Status/WIP
  - Topic/Development
  - Topic/ComputerScience
  - Topic/Windows
  - Topic/Rust
aliases:
  - Rust on Windows
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE]
> **Sources**:
> - [Rust Programming Language](https://rust-lang.org/)
> - [Install Rust - Rust Programming Language](https://rust-lang.org/tools/install/?platform_override=win)
> - [Windows - The rustup book](https://rust-lang.github.io/rustup/installation/windows.html)
> - [rust-lang/rustup: The Rust toolchain installer](https://github.com/rust-lang/rustup)
> - [Installation - The Cargo Book](https://doc.rust-lang.org/cargo/getting-started/installation.html)
> - [MSYS2](https://www.msys2.org/)
> - [MSVC prerequisites - The rustup book](https://rust-lang.github.io/rustup/installation/windows-msvc.html)

This guide is for best practices on installing and managing a [[MOC - Rust|Rust]] development environment on [[MOC - Windows|Windows]].

## Quick Start

1. Download & install the `rustup-init.exe` built for the [`x86_64-pc-windows-msvc`](https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe) or [`aarch64-pc-windows-msvc`](https://static.rust-lang.org/rustup/dist/aarch64-pc-windows-msvc/rustup-init.exe) target, depending on your OS architecture. In general, this is the build of `rustup` one should install on Windows. This will require [MSVC prerequisites](https://rust-lang.github.io/rustup/installation/windows-msvc.html). If you would prefer to install GNU toolchains or the i686 toolchains by default this can be modified at install time, either interactively, with the `--default-host` flag, or after installation via `rustup set default-host`.

2. Install Pre-Requisite Windows 11 SDK & Visual Studio Build Tools

```powershell
winget install --id Microsoft.VisualStudio.2022.Community --source winget --force --override "--add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 --add Microsoft.VisualStudio.Component.VC.Tools.ARM64 --add Microsoft.VisualStudio.Component.Windows11SDK.22621 --addProductLang En-us"
```

## Concepts

First some concepts to digest:

- `rustup` toolchain
- `rustc`
- `cargo`
- MSVS vs. MinGW

## Terminology

- **channel** — Rust is released to three different “channels”: stable, beta, and nightly. See the [Channels](https://rust-lang.github.io/rustup/concepts/channels.html) chapter for more details.    
- **toolchain** — A “toolchain” is a complete installation of the Rust compiler (`rustc`) and related tools (like `cargo`). A [toolchain specification](https://rust-lang.github.io/rustup/concepts/toolchains.html) includes the release channel or version, and the host platform that the toolchain runs on.
- **target** — `rustc` is capable of generating code for many platforms. The “target” specifies the platform that the code will be generated for. By default, `cargo` and `rustc` use the host toolchain’s platform as the target. To build for a different target, usually the target’s standard library needs to be installed first via the `rustup target` command. See the [Cross-compilation](https://rust-lang.github.io/rustup/cross-compilation.html) chapter for more details.
- **component** — Each release of Rust includes several “components”, some of which are required (like `rustc`) and some that are optional (like [`clippy`](https://github.com/rust-lang/rust-clippy)). See the [Components](https://rust-lang.github.io/rustup/concepts/components.html) chapter for more detail.
- **profile** — In order to make it easier to work with components, a “profile” defines a grouping of components. See the [Profiles](https://rust-lang.github.io/rustup/concepts/profiles.html) chapter for more details.
- **proxy** — A wrapper for a common Rust component (like `rustc`), built to forward CLI invocations to the active Rust toolchain. See the [Proxies](https://rust-lang.github.io/rustup/concepts/proxies.html) chapter for more details.


## `rustup`

Rust uses `rustup` as its *toolchain multiplexer*. `rustup` installs and manages many Rust toolchains and presents them all through a single set of tools installed to `~/.cargo/bin/`. The [`rustc`](https://doc.rust-lang.org/rustc/) and [`cargo`](https://doc.rust-lang.org/cargo/) executables installed in `~/.cargo/bin` are *[proxies](https://rust-lang.github.io/rustup/concepts/proxies.html)* that delegate to the real toolchain. `rustup` then provides mechanisms to easily change the active toolchain by reconfiguring the behavior of the proxies.

So when `rustup` is first installed, running `rustc` will run the proxy in `$HOME/.cargo/bin/rustc`, which in turn will run the stable compiler. If you later *change the default toolchain* to nightly with `rustup default nightly`, then that same proxy will run the `nightly` compiler instead.

This is similar to Ruby’s [rbenv](https://github.com/rbenv/rbenv), Python’s [pyenv](https://github.com/yyuu/pyenv), or Node’s [nvm](https://github.com/creationix/nvm).

## Windows

`rustup` works the same on Windows as it does on Unix, but there are some special considerations for Rust developers on Windows. As [mentioned on the Rust download page](https://www.rust-lang.org/tools/install?platform_override=win), there are two [ABIs](https://en.wikipedia.org/wiki/Application_binary_interface) in use on Windows: the native (MSVC) ABI used by [Visual Studio](https://visualstudio.microsoft.com/), and the GNU ABI used by the [GCC toolchain](https://gcc.gnu.org/). Which version of Rust you need depends largely on what C/C++ libraries you want to interoperate with: for interop with software produced by Visual Studio use the MSVC build of Rust; for interop with GNU software built using the [MinGW/MSYS2 toolchain](https://www.msys2.org/) use the GNU build.

When targeting the MSVC ABI, Rust additionally requires an [installation of Visual Studio](https://rust-lang.github.io/rustup/installation/windows-msvc.html) so `rustc` can use its linker and libraries.

When targeting the GNU ABI, no additional software is strictly required for basic use. However, many library crates will not be able to compile until the full [MSYS2](https://www.msys2.org/) with MinGW has been installed.

By default `rustup` on Windows configures Rust to target the MSVC ABI, that is a target tuple of either `i686-pc-windows-msvc`, `x86_64-pc-windows-msvc`, or `aarch64-pc-windows-msvc` depending on the CPU architecture of the host Windows OS. The toolchains that `rustup` chooses to install, unless told otherwise through the [toolchain specification](https://rust-lang.github.io/rustup/concepts/toolchains.html#toolchain-specification), will be compiled to run on that target tuple host and will target that triple by default.

You can change this behavior with `rustup set default-host` or during installation.

For example, to explicitly select the 32-bit MSVC host:

```powershell
rustup set default-host i686-pc-windows-msvc
```

Or to choose the 64 bit GNU toolchain:

```powershell
rustup set default-host x86_64-pc-windows-gnu
```

Since the MSVC ABI provides the best interoperation with other Windows software it is recommended for most purposes. The GNU toolchain is always available, even if you don’t use it by default. Just install it with `rustup toolchain install`:

```powershell
rustup toolchain install stable-gnu
```

You don’t need to switch toolchains to support all windows targets though; a single toolchain supports all four x86 windows targets:

```powershell
rustup target add x86_64-pc-windows-msvc $ rustup target add x86_64-pc-windows-gnu $ rustup target add i686-pc-windows-msvc $ rustup target add i686-pc-windows-gnu
```

See the [Cross-compilation](https://rust-lang.github.io/rustup/cross-compilation.html) chapter for more details on specifying different targets with the same compiler.