param(
  [string]$username = 'supplier_demo',
  [string]$password = '123456',
  [string]$url = 'http://127.0.0.1:5000/api/auth/login'
)

$body = @{ username = $username; password = $password } | ConvertTo-Json
try {
  $r = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType 'application/json' -TimeoutSec 10
  Write-Output "STATUS: 200"
  Write-Output "RESPONSE:"
  $r | ConvertTo-Json -Depth 5
} catch {
  if ($_.Exception.Response) {
    $resp = $_.Exception.Response
    $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $text = $reader.ReadToEnd()
    $status = $resp.StatusCode.value__
    Write-Output "STATUS: $status"
    Write-Output "BODY: $text"
  } else {
    Write-Output "REQUEST_FAILED: $($_.Exception.Message)"
  }
}
