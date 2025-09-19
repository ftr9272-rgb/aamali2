# Start backend reliably: create venv, install requirements, start Flask, then poll http://localhost:5000/
# Usage: Run this script from PowerShell in any working dir.
$repo = Split-Path -Parent (Split-Path -Path $MyInvocation.MyCommand.Definition -Parent)
$api = Join-Path $repo 'business-platform-api'
Write-Output "API folder: $api"
Push-Location $api

# Create venv if missing
if (-Not (Test-Path '.venv')) {
    Write-Output 'Creating virtualenv .venv'
    python -m venv .venv
}
$venvPy = Join-Path (Get-Location) '.venv\Scripts\python.exe'
if (Test-Path $venvPy) {
    Write-Output "Using venv python: $venvPy"
    & $venvPy -m pip install --upgrade pip setuptools wheel
    & $venvPy -m pip install -r requirements.txt
    $py = $venvPy
} else {
    Write-Output "venv python not found, falling back to system python"
    python -m pip install --upgrade pip setuptools wheel
    python -m pip install -r requirements.txt
    $py = 'python'
}

# Start Flask server in background
Write-Output 'Starting Flask server in background (stdout/stderr are not shown)'
$proc = Start-Process -FilePath $py -ArgumentList 'src\main.py' -WorkingDirectory (Get-Location) -WindowStyle Hidden -PassThru
Write-Output "Started process Id: $($proc.Id)"

# Poll for readiness
$timeout = 30
$elapsed = 0
$interval = 2
$ok = $false
while ($elapsed -lt $timeout) {
    Start-Sleep -Seconds $interval
    $elapsed += $interval
    try {
        $r = Invoke-WebRequest -Uri 'http://localhost:5000/' -UseBasicParsing -TimeoutSec 5
        if ($r.StatusCode -eq 200) {
            Write-Output "Server is responding (200). Content length: $($r.RawContentLength)"
            $ok = $true
            break
        }
    } catch {
        Write-Output "Waiting for server... ($elapsed/$timeout)"
    }
}
if (-Not $ok) {
    Write-Output 'Server did not respond within timeout. Gathering diagnostics:'
    Write-Output 'Netstat lines matching 5000:'
    netstat -ano | findstr 5000
    Write-Output 'Python processes:'
    Get-Process python -ErrorAction SilentlyContinue | Select-Object Id,ProcessName,StartTime | Format-Table -AutoSize
}

Pop-Location
Write-Output 'Script finished.'
