Param(
  [Parameter(Mandatory=$true)]
  [string]$ZipPath,
  [switch]$Confirm
)

if (!(Test-Path $ZipPath)) { Write-Error "Zip file not found: $ZipPath"; exit 1 }

if (-not $Confirm) {
  Write-Host "This will overwrite files in the repository with contents from: $ZipPath"
  Write-Host "Rerun with -Confirm to proceed."
  exit 0
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Restoring from $ZipPath into $root"

# create a backup of current state before restoring
$backupDir = Join-Path $root ".restore_points"
if (!(Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }
$backupName = "pre_restore_$(Get-Date -Format 'yyyyMMdd_HHmmss').zip"
$backupPath = Join-Path $backupDir $backupName
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($root, $backupPath)
Write-Host "Backup created at $backupPath"

# extract zip to temporary dir then copy over files
$temp = Join-Path $env:TEMP ("restore_unzip_" + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $temp | Out-Null
[System.IO.Compression.ZipFile]::ExtractToDirectory($ZipPath, $temp)

# copy files from temp to root (overwrite)
Get-ChildItem -Path $temp -Recurse -File | ForEach-Object {
  $dest = Join-Path $root ($_.FullName.Substring($temp.Length).TrimStart('\'))
  $dDir = Split-Path -Parent $dest
  if (!(Test-Path $dDir)) { New-Item -ItemType Directory -Path $dDir -Force | Out-Null }
  Copy-Item -Path $_.FullName -Destination $dest -Force
}

# cleanup
Remove-Item -Path $temp -Recurse -Force

Write-Host "Restore complete. A backup of the previous state is available at: $backupPath"