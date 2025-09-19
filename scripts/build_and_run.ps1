# Build frontend with pnpm and copy the production files to backend static folder
# Then start the Flask server

# Set paths
$repo = "C:\Users\ffwfj\OneDrive\Desktop\salasa5"
$frontend = Join-Path $repo "enhanced-business-platform"
$backend = Join-Path $repo "business-platform-api"
$backend_static = Join-Path $backend "src\static"

Write-Output "Repository: $repo"
Write-Output "Frontend: $frontend"
Write-Output "Backend: $backend"
Write-Output "Backend static: $backend_static"

# Build frontend
Push-Location $frontend
Write-Output "Running: pnpm install"
pnpm install
Write-Output "Running: pnpm build"
pnpm run build
Pop-Location

# Ensure backend static folder exists and is emptied
if (-Not (Test-Path $backend_static)) {
    Write-Output "Creating backend static folder..."
    New-Item -ItemType Directory -Path $backend_static | Out-Null
}

Write-Output "Removing old static files..."
Get-ChildItem -Path $backend_static -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

# Copy dist -> backend static
$dist = Join-Path $frontend "dist"
if (-Not (Test-Path $dist)) {
    Write-Error "Frontend build output not found in: $dist. Make sure pnpm build succeeded."
    exit 1
}

Write-Output "Copying built frontend files to backend static folder..."
Copy-Item -Path (Join-Path $dist "*") -Destination $backend_static -Recurse -Force

Write-Output "Done. Frontend is deployed to backend static folder."

# Start the Flask server
Push-Location $backend
Write-Output "Starting Flask server..."
python app.py
Pop-Location