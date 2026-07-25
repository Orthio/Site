#!/usr/bin/env python3
"""
Update the `wildFeatures:` block in Obsidian markdown hex notes.

Expected JSON format:
[
  {
    "id": "012.001",
    "wildFeatures": ["Value 1", "Value 2", "None", "Value 4"]
  }
]

Usage:

Dry run:
    python update_hex_wild_features.py "C:\path\to\02 Maziatry Hex Keys" "new_wildFeatures_only.json"

Apply changes:
    python update_hex_wild_features.py "C:\path\to\02 Maziatry Hex Keys" "new_wildFeatures_only.json" --apply

Apply without backups:
    python update_hex_wild_features.py "C:\path\to\02 Maziatry Hex Keys" "new_wildFeatures_only.json" --apply --no-backup
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from pathlib import Path
from typing import Any


HEX_ID_RE = re.compile(r"^(?P<id>\d{3}\.\d{3})(?:\b|$)")

# Matches:
# wildFeatures:
# - value
# - value
# ...
#
# It stops at the next non-indented YAML-style field, such as:
# settlement:
WILD_FEATURES_BLOCK_RE = re.compile(
    r"(?m)"
    r"^wildFeatures:"
    r"(?:[ \t]*[^\r\n]*\r?\n"
    r"|[ \t]*\r?\n(?:^[ \t]*-[^\r\n]*(?:\r?\n|$))*)"
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Update wildFeatures blocks in recursively searched markdown hex notes."
    )
    parser.add_argument(
        "root",
        type=Path,
        help="Root folder containing all region folders and markdown notes.",
    )
    parser.add_argument(
        "json_file",
        type=Path,
        help="JSON file containing id and wildFeatures values.",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Actually write changes. Without this flag, the script performs a dry run.",
    )
    parser.add_argument(
        "--no-backup",
        action="store_true",
        help="Do not create .bak files when applying changes.",
    )
    return parser.parse_args()


def load_updates(json_path: Path) -> dict[str, list[Any]]:
    try:
        raw = json.loads(json_path.read_text(encoding="utf-8-sig"))
    except FileNotFoundError:
        raise SystemExit(f"JSON file not found: {json_path}")
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Could not parse JSON: {exc}")

    if isinstance(raw, dict):
        # Also allow:
        # {
        #   "012.001": ["A", "B", "C", "D"]
        # }
        if all(isinstance(key, str) for key in raw):
            updates: dict[str, list[Any]] = {}
            for hex_id, values in raw.items():
                if isinstance(values, dict) and "wildFeatures" in values:
                    values = values["wildFeatures"]
                if not isinstance(values, list):
                    raise SystemExit(
                        f"{hex_id}: wildFeatures must be a JSON list."
                    )
                updates[hex_id.strip()] = values
            return updates

    if not isinstance(raw, list):
        raise SystemExit(
            "JSON must be either a list of objects or an object keyed by hex ID."
        )

    updates = {}
    for index, item in enumerate(raw, start=1):
        if not isinstance(item, dict):
            raise SystemExit(f"JSON item {index} is not an object.")

        hex_id = item.get("id")
        values = item.get("wildFeatures")

        if not isinstance(hex_id, str):
            raise SystemExit(f"JSON item {index} has no valid string 'id'.")
        if not isinstance(values, list):
            raise SystemExit(
                f"{hex_id}: 'wildFeatures' must be a JSON list."
            )

        hex_id = hex_id.strip()

        if not re.fullmatch(r"\d{3}\.\d{3}", hex_id):
            raise SystemExit(f"Invalid hex ID in JSON: {hex_id!r}")

        if hex_id in updates:
            raise SystemExit(f"Duplicate hex ID in JSON: {hex_id}")

        updates[hex_id] = values

    return updates


def build_markdown_lookup(root: Path) -> dict[str, list[Path]]:
    """
    Recursively search every region folder beneath root.

    The hex ID is taken from the beginning of the filename:
      012.001.md
      012.001 - Something.md
    """
    lookup: dict[str, list[Path]] = {}

    for path in sorted(root.rglob("*.md")):
        if not path.is_file():
            continue

        match = HEX_ID_RE.match(path.stem)
        if not match:
            continue

        hex_id = match.group("id")
        lookup.setdefault(hex_id, []).append(path)

    return lookup


def yaml_scalar(value: Any) -> str:
    """
    Produce a compact YAML-style scalar.

    Plain strings are left unquoted where safe.
    Strings containing awkward YAML characters are JSON-quoted.
    None becomes the literal word None, matching the user's preferred format.
    """
    if value is None:
        return "None"

    if isinstance(value, bool):
        return "true" if value else "false"

    if isinstance(value, (int, float)):
        return str(value)

    text = str(value)

    if text == "":
        return '""'

    unsafe = (
        text != text.strip()
        or text.lower() in {
            "null", "none", "true", "false", "yes", "no", "on", "off",
        }
        or text.startswith(("-", "?", ":", "!", "&", "*", "#", "{", "}", "[", "]", ",", "|", ">", "@", "`", "%"))
        or ": " in text
        or " #" in text
        or "\n" in text
        or "\r" in text
    )

    return json.dumps(text, ensure_ascii=False) if unsafe else text


def format_wild_features(values: list[Any], newline: str) -> str:
    lines = ["wildFeatures:"]
    lines.extend(f"- {yaml_scalar(value)}" for value in values)
    return newline.join(lines) + newline


def replace_wild_features(text: str, values: list[Any]) -> tuple[str, str]:
    """
    Returns:
      (new_text, status)

    status is one of:
      updated
      identical
      missing_block
    """
    newline = "\r\n" if "\r\n" in text else "\n"
    replacement = format_wild_features(values, newline)

    match = WILD_FEATURES_BLOCK_RE.search(text)
    if match is None:
        return text, "missing_block"

    existing = match.group(0)

    # Normalise line endings only for comparison.
    if existing.replace("\r\n", "\n") == replacement.replace("\r\n", "\n"):
        return text, "identical"

    new_text = text[: match.start()] + replacement + text[match.end() :]
    return new_text, "updated"


def read_text_preserving_encoding(path: Path) -> tuple[str, str]:
    """
    Try UTF-8 first, then UTF-8 with BOM, then Windows-1252.
    Returns the decoded text and the encoding to use when writing.
    """
    data = path.read_bytes()

    if data.startswith(b"\xef\xbb\xbf"):
        return data.decode("utf-8-sig"), "utf-8-sig"

    try:
        return data.decode("utf-8"), "utf-8"
    except UnicodeDecodeError:
        return data.decode("cp1252"), "cp1252"


def verify_written_file(path: Path, expected_values: list[Any]) -> tuple[bool, str]:
    text, _encoding = read_text_preserving_encoding(path)
    match = WILD_FEATURES_BLOCK_RE.search(text)

    if match is None:
        return False, "wildFeatures block not found after writing"

    newline = "\r\n" if "\r\n" in text else "\n"
    expected = format_wild_features(expected_values, newline)

    actual_normalised = match.group(0).replace("\r\n", "\n")
    expected_normalised = expected.replace("\r\n", "\n")

    if actual_normalised != expected_normalised:
        return False, "saved wildFeatures block does not match JSON"

    return True, ""


def main() -> int:
    args = parse_args()

    root = args.root.expanduser().resolve()
    json_file = args.json_file.expanduser().resolve()

    if not root.exists():
        print(f"Root folder not found: {root}", file=sys.stderr)
        return 1
    if not root.is_dir():
        print(f"Root path is not a folder: {root}", file=sys.stderr)
        return 1

    updates = load_updates(json_file)
    markdown_lookup = build_markdown_lookup(root)

    changed: list[tuple[str, Path]] = []
    identical: list[tuple[str, Path]] = []
    missing_files: list[str] = []
    duplicate_files: list[tuple[str, list[Path]]] = []
    missing_blocks: list[tuple[str, Path]] = []
    errors: list[tuple[str, Path, str]] = []

    print("SCRIPT VERSION: 3")
    print("APPLY MODE" if args.apply else "DRY RUN")
    print(f"Root: {root}")
    print(f"JSON: {json_file}")
    print(f"Updates in JSON: {len(updates)}")
    print(f"Indexed markdown hex IDs: {len(markdown_lookup)}")
    print()

    for hex_id in sorted(updates):
        values = updates[hex_id]
        matches = markdown_lookup.get(hex_id, [])

        if not matches:
            missing_files.append(hex_id)
            continue

        if len(matches) > 1:
            duplicate_files.append((hex_id, matches))
            continue

        path = matches[0]

        try:
            original_text, encoding = read_text_preserving_encoding(path)
            new_text, status = replace_wild_features(original_text, values)

            if status == "missing_block":
                missing_blocks.append((hex_id, path))
                continue

            if status == "identical":
                identical.append((hex_id, path))
                continue

            changed.append((hex_id, path))

            if args.apply:
                if not args.no_backup:
                    backup_path = path.with_suffix(path.suffix + ".bak")
                    if not backup_path.exists():
                        shutil.copy2(path, backup_path)

                path.write_text(new_text, encoding=encoding, newline="")

                verified, reason = verify_written_file(path, values)
                if not verified:
                    errors.append((hex_id, path, reason))

        except Exception as exc:
            errors.append((hex_id, path, str(exc)))

    action_word = "Updated" if args.apply else "Would update"

    print(f"{action_word}: {len(changed)}")
    for hex_id, path in changed:
        print(f"  {hex_id}: {path}")

    print()
    print(f"Already identical: {len(identical)}")
    for hex_id, path in identical:
        print(f"  {hex_id}: {path}")

    print()
    print(f"Hex IDs not found: {len(missing_files)}")
    for hex_id in missing_files:
        print(f"  {hex_id}")

    print()
    print(f"Duplicate hex IDs skipped: {len(duplicate_files)}")
    for hex_id, paths in duplicate_files:
        print(f"  {hex_id}:")
        for path in paths:
            print(f"    {path}")

    print()
    print(f"Files without a recognised wildFeatures block: {len(missing_blocks)}")
    for hex_id, path in missing_blocks:
        print(f"  {hex_id}: {path}")

    print()
    print(f"Errors or failed verification: {len(errors)}")
    for hex_id, path, reason in errors:
        print(f"  {hex_id}: {path}")
        print(f"    {reason}")

    print()
    if args.apply:
        if args.no_backup:
            print("Finished. Changes were applied without creating backups.")
        else:
            print("Finished. Existing notes were backed up as .md.bak where changes were made.")
    else:
        print("Dry run finished. No files were changed. Add --apply to write the changes.")

    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
