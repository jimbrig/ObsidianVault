---
creation_date: 2026-05-30
modification_date: 2026-05-30
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Guide - WSL2 Development Environment Setup
tags:
  - Type/Code
  - Type/Guide
  - Status/WIP
  - Topic/Development
  - Topic/Windows
  - Topic/Linux
  - Topic/ComputerScience
aliases:
  - WSL2 Development Environment Setup Guide
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Prerequisites & Windows Foundation

> [!NOTE]
> *Before touching [[Windows Subsystem for Linux (WSL)|WSL]], lay the groundwork on the [[MOC - Windows|Windows]] host. This ensures the terminal, fonts, and interop bridges are in place before the [[MOC - Linux|Linux]] layer is configured.*

### Install / Update WSL

```powershell
# (admin)
wsl --install
wsl --update
wsl --set-default-version 2
```

### Terminal Emulator

There are many options for Terminal these days. Of the available options, I would consider these three to be the most mature or practical choices:

- [WezTerm](): Cross-platform, [[Graphics Processing Unit (GPU)|GPU]]-accelerated, configured entirely in [[Lua]] (`~/.wezterm.lua)`. Excellent WSL2 integration, built-in multiplexing for tabs/splits without needing [[tmux]] and handles font fallback gracefully. Strongly recommended for Windows users who want parity between Windows, WSL2, and [[Secure Shell (SSH)|SSH]] sessions.
- [Ghostty](): Most popular option. Native, blazingly fast, and minimal. Currently has limited Windows support compared to [[macOS]]/[[MOC - Linux|Linux]] builds however.
- [Windows Terminal](): Free and ships natively with Windows. Lowest friction and fully adequate. Comes with options for Canary and Preview builds also.

From [[MOC - PowerShell|PowerShell]] on [[MOC - Windows|Windows]]:

```powershell
# install wezterm
winget intall wez.wezterm

# install windows terminal preview
Microsoft.WindowsTerminal.Preview
```

### Nerd Fonts

> [!NOTE]
> *See all nerd-fonts at: https://www.nerdfonts.com/font-downloads*

```powershell
winget install DEVCOM.JetBrainsMonoNerdFont
```

The [nerd-fonts scoop bucket]() is another useful way of getting fonts:

```powershell
scoop bucket add nerd-fonts
# cascadia code
scoop install CascadiaCode-NF Cascadia-Code
# firacode 
scoop install FiraCode-NF
# meslo 
scoop install Meslo-NF Meslo-NF-Mono Meslo-NF-Propo 
```

### Install WSL Distributions

I will be installing:

- [Ubuntu 24.04 LTS]()
- [Arch Linux]()

```powershell
wsl --install -d Ubuntu-24.04
wsl --install -d archlinux 
```

### Configure `~/.wslconfig`

```ini
[wsl2]
# Resource limits — adjust to your hardware
memory=12GB
processors=8
swap=4GB

# Sparse VHD: disk file grows as you use it, not pre-allocated
sparseVhd=true

# Mirrored networking (Windows 11 23H2+): WSL and Windows share the same
# network interface and IP. `localhost` works bidirectionally without hacks.
networkingMode=mirrored
firewall=true
localhostForwarding=true

[experimental]
# Gradually reclaim unused memory instead of holding it until shutdown
autoMemoryReclaim=gradual
```

> [!NOTE]
> `networkingMode=mirrored` requires Windows 11 23H2 or later. When enabled, `localhost` in WSL2 reaches Windows services and vice versa with zero configuration, removing a major friction point in development.

## Arch Linux

```sh
# as root from arch shell
pacman-key --init && pacman-key --populate
pacman -Syyu --noconfirm
# base packages
pacman -S --needed base-devel git curl wget zsh neovim tmux \
  man-db man-pages reflector sudo openssh unzip tar xdg-utils
# optimize mirrors
reflector --country "United States" --age 12 --protocol https \
  --sort rate --save /etc/pacman.d/mirrorlist
# locale
sed -i 's/#en_US.UTF-8/en_US.UTF-8/' /etc/locale.gen
locale-gen
echo "LANG=en_US.UTF-8" > /etc/locale.conf
# create user
useradd -m -G wheel -s /usr/bin/zsh -d /home/jimmy jimmy
passwd jimmy
# editor sudo for wheel group
# uncomment %wheel ALL=(ALL:ALL) ALL
sed -i '/%wheel ALL=(ALL:ALL) ALL/s/^# //' /etc/sudoers
```

From Windows:

```powershell
wsl --manage archlinux --set-default-user jimmy
```

Back in Arch:

```sh
sudo nvim /etc/wsl.conf
```

and edit using [[Vim]]:

```ini
# /etc/wsl.conf

[boot]
systemd=true            # enable systemd as PID 1

[user]
default=jimmy           # auto-login as your user

[automount]
enabled=true
root=/mnt/
options="metadata,rw,umask=22,fmask=11"
mountFsTab=false

[network]
generateHosts=true
generateResolvConf=true

[interop]
enabled=true
appendWindowsPath=false  # keep Linux PATH clean; add Windows tools explicitly
```

`:wq` to exit and save. and exit the shell also, `exit`.

Then back in Windows:

```powershell
wsl --shutdown
sleep 5
wsl -d archlinux
```

```sh
# check that systemctl is running
systemctl is-system-running
# navigate to ~ and get AUR Helper
cd ~/tmp
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si --noconfirm
# will install a bunch of stuff
# ...
# cleanup
cd ~ && rm -rf /tmp/paru
# test
paru --version
```

## XDG

```sh
mkdir -p \
  "$HOME/.config" \
  "$HOME/.local/bin" \
  "$HOME/.local/share" \
  "$HOME/.local/state" \
  "$HOME/.cache"
```

Set XDG variables in `/etc/profile.d/xdg.sh`:

```sh
sudo nvim /etc/profile.d/xdg.sh
```

```sh
# /etc/profile.d/xdg.sh
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_STATE_HOME="$HOME/.local/state"
export XDG_BIN_HOME="$HOME/.local/bin"
export PATH="$HOME/.local/bin:$PATH"
```

exit `:wq` and source it:

```sh
source /etc/profile.d/xdg.sh
```

Install `xdg-ninja`:

```sh
paru -S xdg-ninja
xdg-ninja
```

## Setup `zsh` and `Zinit`

`~/.zshenv` is required to stay in `$HOME` unless you prefer to use the system `/etc/zsh/zshenv` instead:

```zsh
# ~/.zshenv

# XDG (ensure always set, even when /etc/profile.d isn't sourced)
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_STATE_HOME="$HOME/.local/state"

# Redirect common non-compliant tools to XDG paths
export ZDOTDIR="$XDG_CONFIG_HOME/zsh"       # move all zsh config out of $HOME
export HISTFILE="$XDG_STATE_HOME/zsh/history"
export CARGO_HOME="$XDG_DATA_HOME/cargo"
export RUSTUP_HOME="$XDG_DATA_HOME/rustup"
export GOPATH="$XDG_DATA_HOME/go"
export GOBIN="$HOME/.local/bin"
export NPM_CONFIG_USERCONFIG="$XDG_CONFIG_HOME/npm/npmrc"
export NODE_REPL_HISTORY="$XDG_STATE_HOME/node_repl_history"
export LESSHISTFILE="$XDG_STATE_HOME/less/history"
export INPUTRC="$XDG_CONFIG_HOME/readline/inputrc"
export WGETRC="$XDG_CONFIG_HOME/wget/wgetrc"
export DOCKER_CONFIG="$XDG_CONFIG_HOME/docker"
export GNUPGHOME="$XDG_DATA_HOME/gnupg"
export RIPGREP_CONFIG_PATH="$XDG_CONFIG_HOME/ripgrep/config"

export PATH="$HOME/.local/bin:$PATH"
```

Create `ZDOTDIR`:

```sh
mkdir -p "$HOME/.config/zsh"
mkdir -p "$HOME/.local/state/zsh"
touch "$HOME/.local/state/zsh/history"
```

Install `Zinit`:

```sh
ZINIT_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/zinit/zinit.git"
mkdir -p "$(dirname $ZINIT_HOME)"
git clone https://github.com/zdharma-continuum/zinit.git "$ZINIT_HOME"
```

Configure `zsh` (`nvim ~/.config/zsh/.zshrc`):

```zsh
# ~/.config/zsh/.zshrc

# ─── Zinit Bootstrap ────────────────────────────────────────────────────────
ZINIT_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/zinit/zinit.git"
source "${ZINIT_HOME}/zinit.zsh"
autoload -Uz _zinit
(( ${+_comps} )) && _comps[zinit]=_zinit

# ─── History ────────────────────────────────────────────────────────────────
HISTSIZE=100000
SAVEHIST=100000
setopt HIST_SAVE_NO_DUPS
setopt HIST_IGNORE_ALL_DUPS
setopt INC_APPEND_HISTORY
setopt SHARE_HISTORY

# ─── Options ────────────────────────────────────────────────────────────────
setopt AUTO_CD
setopt CORRECT
setopt EXTENDED_GLOB
setopt NO_BEEP

# ─── Completion ─────────────────────────────────────────────────────────────
autoload -Uz compinit
zstyle ':completion:*' cache-path "$XDG_CACHE_HOME/zsh/zcompcache"
compinit -d "$XDG_CACHE_HOME/zsh/zcompdump-$ZSH_VERSION"

# ─── Plugins (Zinit, Turbo Mode) ────────────────────────────────────────────
zinit wait lucid light-mode for \
  atinit"zicompinit; zicdreplay" \
    zdharma-continuum/fast-syntax-highlighting \
  blockf atpull"zinit creinstall -q ." \
    zsh-users/zsh-completions \
  atload"_zsh_autosuggest_start" \
    zsh-users/zsh-autosuggestions

# OMZ snippets (loaded lazily from upstream)
zinit snippet OMZL::git.zsh
zinit snippet OMZP::git
zinit snippet OMZP::sudo

# ─── Modern CLI Tools Integration ───────────────────────────────────────────
# zoxide (smart cd)
eval "$(zoxide init zsh --cmd cd)"

# fzf
source <(fzf --zsh)
export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_ALT_C_COMMAND='fd --type d --hidden --follow --exclude .git'

# atuin (shell history with SQLite)
eval "$(atuin init zsh)"

# mise (version manager)
eval "$(mise activate zsh)"

# ─── Aliases — Modern Tool Replacements ─────────────────────────────────────
alias ls='eza --icons --group-directories-first'
alias ll='eza -alg --icons --git --group-directories-first --header'
alias lt='eza --tree --icons --level=2 --group-directories-first'
alias cat='bat --style=auto'
alias grep='rg'
alias find='fd'
alias du='dust'
alias ps='procs'
alias top='btop'
alias diff='delta'
alias man='batman'  # bat-powered man pages

# Git
alias g='git'
alias lg='lazygit'

# Tmux
alias ta='tmux attach-session -t'
alias tl='tmux list-sessions'
alias tn='tmux new-session -s'

# WSL convenience
alias open='wslview'   # xdg-open shim → Windows default apps
alias pbcopy='clip.exe'
alias pbpaste='powershell.exe -command Get-Clipboard'
alias explorer='explorer.exe .'
alias winhome='cd /mnt/c/Users/$(cmd.exe /c "echo %USERNAME%" 2>/dev/null | tr -d "\r")'

# ─── Starship Prompt ─────────────────────────────────────────────────────────
eval "$(starship init zsh)"
```

Change shell:

```sh
chsh -s /usr/bin/zsh
```

Install starship:

```sh
curl -sS https://starship.rs/install.sh | sh -s -- -b "$HOME/.local/bin"
```

## Tools

```sh
sudo pacman -S \
  ripgrep \      # rg: grep replacement (respects .gitignore, parallel)
  fd \           # fd: find replacement (fast, intuitive syntax)
  bat \          # bat: cat with syntax highlighting and git integration
  eza \          # eza: ls replacement with icons, git status, tree view
  zoxide \       # z: smart directory jumping with frecency
  fzf \          # fuzzy finder: used by many integrations
  atuin \        # Atuin: shell history in SQLite with search
  dust \         # dust: du replacement with visual tree
  btop \         # btop: top/htop replacement with rich TUI
  delta \        # delta: diff pager with syntax highlighting
  procs \        # procs: ps replacement
  lazygit \      # lazygit: full TUI git client
  tokei \        # tokei: count lines of code
  hyperfine \    # hyperfine: command-line benchmarking tool
  xdg-utils      # xdg-open etc. (routes to Windows apps via WSLg/wsl-open)
```

```sh
atuin import auto
atuin register -u jimmy -e jimmy.briggs@jimbrig.com
atuin sync
```

```sh
mkdir -p "$XDG_CONFIG_HOME/ripgrep"
cat > "$XDG_CONFIG_HOME/ripgrep/config" << 'EOF'
--smart-case
--hidden
--glob=!.git
EOF
```

```sh
sudo pacman -S mise

# Install common runtimes
mise use --global node@lts
mise use --global python@3.13
mise use --global rust@stable
```

```sh
sudo pacman -S neovim
nvim --version

# for treesitter and Mason LSP installer
sudo pacman -S \
  ripgrep fd lazygit make gcc \
  tree-sitter-cli nodejs npm  
```

```sh
# Back up any existing config
mv ~/.config/nvim{,.bak} 2>/dev/null
mv ~/.local/share/nvim{,.bak} 2>/dev/null
mv ~/.local/state/nvim{,.bak} 2>/dev/null
mv ~/.cache/nvim{,.bak} 2>/dev/null

# Clone starter
git clone https://github.com/LazyVim/starter ~/.config/nvim
rm -rf ~/.config/nvim/.git   # detach from starter repo
```

bootstrap `nvim` w/ `LazyVim`:

```sh
# in nvim
:LazyHealth
```

add to `~/.config/nvim/lua/config/options.lua`:

```sh
-- WSL clipboard integration
if vim.fn.has("wsl") == 1 then
  vim.g.clipboard = {
    name = "WslClipboard",
    copy = {
      ["+"] = "clip.exe",
      ["*"] = "clip.exe",
    },
    paste = {
      ["+"] = 'powershell.exe -c [Console]::Out.Write($(Get-Clipboard -Raw).tostring().replace("`r", ""))',
      ["*"] = 'powershell.exe -c [Console]::Out.Write($(Get-Clipboard -Raw).tostring().replace("`r", ""))',
    },
    cache_enabled = 0,
  }
end
```

```sh
git config --global user.name "Jimmy Briggs"
git config --global user.email "your@email.com"
git config --global init.defaultBranch main
git config --global core.autocrlf false   # critical: always use LF in WSL
git config --global pull.rebase true
git config --global push.autoSetupRemote true

# Use delta as pager
git config --global core.pager delta
git config --global interactive.diffFilter "delta --color-only"
git config --global delta.navigate true
git config --global delta.dark true
git config --global merge.conflictstyle diff3
git config --global diff.colorMoved default
```