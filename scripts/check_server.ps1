$uri = 'http://127.0.0.1:5000'
try {
  $r = Invoke-WebRequest -Uri $uri -UseBasicParsing -TimeoutSec 8
  Write-Output "HTTP_STATUS:$($r.StatusCode)"
  Write-Output '---HTTP_BODY_HEAD---'
  $body = $r.Content
  if ($null -eq $body) { Write-Output 'NO_BODY' } else { if ($body.Length -gt 600) { Write-Output $body.Substring(0,600) } else { Write-Output $body } }
} catch {
  Write-Output "HTTP_REQUEST_FAILED: $($_.Exception.Message)"
}
