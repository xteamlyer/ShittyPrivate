# img-release-action

Automatically builds a bootable GPT disk image from the contents of the
`input/` directory and publishes it as a GitHub Release.

## How it works

```
input/
└── EFI/
    └── Boot/
        ├── bootx64.efi      ← your UEFI boot entry
        └── ...              ← any other files
```

Whatever you put in `input/` ends up at the root of the FAT32 EFI System
Partition inside the generated `.img` file. Directory structure is preserved.

The resulting image:

```
<name>.img  (GPT, 64 MiB by default)
└── partition 1: EFI System Partition (FAT32)
    └── (contents of input/)
```

## Usage

1. Fork or clone this repository.
2. Put your files into `input/` (commit & push).
3. Go to **Actions → Build & Release Disk Image → Run workflow**.
4. Fill in the inputs:

| Input | Required | Description | Example |
|-------|----------|-------------|---------|
| `image_name` | ✅ | File name without `.img` | `efiguard` |
| `tag_name` | ✅ | Git tag to create | `v1.0.0` |
| `release_title` | ✅ | Release title on GitHub | `EfiGuard v1.0` |
| `release_notes` | ❌ | Markdown release description | `Initial release` |
| `img_size_mib` | ❌ | Total image size in MiB (≥ 8) | `64` |
| `prerelease` | ❌ | Mark as pre-release | `false` |

5. The action creates a git tag, a GitHub Release, and attaches `<name>.img`.

## Using the image

### With Ventoy
Copy `<name>.img` to your Ventoy USB drive and select it from the boot menu.

### With `dd` (write directly to USB)
```bash
sudo dd if=<name>.img of=/dev/sdX bs=4M status=progress && sync
```

### Manual ESP installation
Mount your existing EFI System Partition and copy the contents of `input/`
into it manually.

## Disk image layout

```
Offset      Size       Content
──────────────────────────────────────────
0           2 MiB      GPT header + gap
2 MiB       size-4     EFI System Partition (FAT32)
size-2 MiB  2 MiB      GPT backup header
```
