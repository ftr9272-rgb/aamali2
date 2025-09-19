Restore point scripts

Usage:

1) Create a restore point (نقطة الرجوع):

```powershell
# from project root (enhanced-business-platform)
.\create_restore_point.ps1 -Name "my_checkpoint"
```

This creates `.restore_points\نقطة_الرجوع_my_checkpoint.zip` with the current project snapshot (excluding `.git`, `node_modules`, `dist`, and `.restore_points`).

2) Restore from a restore point:

```powershell
.\restore_restore_point.ps1 -ZipPath ".restore_points\نقطة_الرجوع_my_checkpoint.zip" -Confirm
```

Important notes:
- `restore_restore_point.ps1` creates a pre-restore backup zip before overwriting files, named `pre_restore_<timestamp>.zip` in `.restore_points` so you can go back if needed.
- Test locally before running on production or CI.
- These scripts are designed for Windows PowerShell (they rely on System.IO.Compression). They should work on modern Windows systems.

If you want I can add a small npm/pnpm script wrappers and a short Git-friendly mode (create a branch instead of zipping).