#!/usr/bin/env python3
"""Pack a deployable EdgeOne Pages zip: index.html and assets/ at archive root.

Usage (from the repo root or anywhere):
    python3 scripts/pack-site.py

Output:
    dist/mnwei-site.zip

Re-run after dropping generated photos into assets/img/. The zip is the
upload artifact; this script does not deploy.
"""

from __future__ import annotations

import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "dist" / "mnwei-site.zip"
SKIP_NAMES = {".DS_Store", ".gitkeep"}


def main() -> int:
    index = ROOT / "index.html"
    assets = ROOT / "assets"
    if not index.is_file():
        print("missing index.html", file=sys.stderr)
        return 1
    if not assets.is_dir():
        print("missing assets/", file=sys.stderr)
        return 1

    files = [index]
    files.extend(
        p
        for p in assets.rglob("*")
        if p.is_file() and p.name not in SKIP_NAMES and not p.name.startswith(".")
    )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    if OUT.exists():
        OUT.unlink()

    with zipfile.ZipFile(OUT, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for path in files:
            arcname = path.relative_to(ROOT).as_posix()
            zf.write(path, arcname)

    with zipfile.ZipFile(OUT) as zf:
        names = zf.namelist()
    if "index.html" not in names:
        print("zip missing index.html at root", file=sys.stderr)
        return 1
    if any(name.startswith("/") or name.startswith("..") for name in names):
        print("unsafe zip path", file=sys.stderr)
        return 1
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size} bytes, {len(names)} files)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
