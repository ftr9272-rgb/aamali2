param([string]$path)
Get-ChildItem -Path $path | ForEach-Object {
  $h = Get-FileHash -Algorithm MD5 $_.FullName
  Write-Output ("{0}  {1}" -f $_.Name, $h.Hash)
}
