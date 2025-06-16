#!/bin/sh
echo -ne '\033c\033]0;Restoration\a'
base_path="$(dirname "$(realpath "$0")")"
"$base_path/Restoration.x86_64" "$@"
