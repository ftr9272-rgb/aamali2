Param(
  [string]$Name = $(Get-Date -Format "yyyyMMdd_HHmmss")
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$restoreDir = Join-Path $root ".restore_points"
if (!(Test-Path $restoreDir)) { New-Item -ItemType Directory -Path $restoreDir | Out-Null }

# make safe filename
$cleanName = $Name -replace '[^0-9A-Za-z_\-\u0600-\u06FF]', '_'
$zipName = "نقطة_الرجوع_$cleanName.zip"
$zipPath = Join-Path $restoreDir $zipName

Write-Host "Creating restore point: $zipPath"

# exclude large or stateful directories
$exclusions = @('.git','node_modules','dist','.restore_points')
$files = Get-ChildItem -Path $root -Recurse -File | Where-Object {
  $exclude = $false
  foreach ($e in $exclusions) { if ($_.FullName -like "*$e*") { $exclude = $true; break } }
  -not $exclude
}

# create a temp folder
$temp = Join-Path $env:TEMP ("restore_temp_" + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $temp | Out-Null

foreach ($f in $files) {
  $dest = Join-Path $temp ($f.FullName.Substring($root.Length).TrimStart('\'))
  $dDir = Split-Path -Parent $dest
  if (!(Test-Path $dDir)) { New-Item -ItemType Directory -Path $dDir -Force | Out-Null }
  Copy-Item -Path $f.FullName -Destination $dest -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($temp, $zipPath)

# cleanup temp
Remove-Item -Path $temp -Recurse -Force

Write-Host "Restore point created: $zipPath"
Write-Host "To restore, run: .\restore_restore_point.ps1 -ZipPath \"$zipPath\" -Confirm:$true"