param(
  [string]$url = 'http://127.0.0.1:5000/api/auth/login'
)
$headers = @{ 'Content-Type' = 'application/json'; 'Origin' = 'http://localhost:5173' }
$body = @{ username = 'supplier_demo'; password = '123456' } | ConvertTo-Json
try {
  $response = Invoke-WebRequest -Uri $url -Method POST -Body $body -Headers $headers -ContentType 'application/json' -TimeoutSec 10 -UseBasicParsing
  Write-Output "STATUS: $($response.StatusCode.Value__)"
  Write-Output 'HEADERS:'
  $response.Headers | ForEach-Object { Write-Output ("{0}: {1}" -f $_.Key, $_.Value) }
  Write-Output '---BODY---'
  if ($response.Content.Length -gt 0) { Write-Output $response.Content } else { Write-Output '<EMPTY>' }
} catch {
  if ($_.Exception.Response) {
    $resp = $_.Exception.Response
    $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $text = $reader.ReadToEnd()
    Write-Output "STATUS: $($resp.StatusCode.value__)"
    Write-Output "BODY: $text"
  } else {
    Write-Output "REQUEST_FAILED: $($_.Exception.Message)"
  }
}
