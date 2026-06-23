# Quick API smoke test
$ErrorActionPreference = "Stop"

Write-Host "=== Products (public) ==="
$products = (Invoke-WebRequest -Uri 'http://127.0.0.1:8000/api/products?limit=3' -UseBasicParsing).Content | ConvertFrom-Json
Write-Host ("Returned {0} products" -f $products.Count)
$products | ForEach-Object { Write-Host ("  - {0}  ${1}  ({2} / {3})" -f $_.name, $_.price, $_.category.name, $_.brand.name) }

Write-Host "`n=== Login demo user ==="
$body = '{"email":"demo@user.com","password":"demo123"}'
$resp = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/api/auth/login' -Method Post -ContentType 'application/json' -Body $body -UseBasicParsing
$login = $resp.Content | ConvertFrom-Json
Write-Host ("HTTP {0}  user={1}  role={2}  tokenLen={3}" -f $resp.StatusCode, $login.user.email, $login.user.role, $login.access_token.Length)

Write-Host "`n=== Admin login + stats ==="
$abody = '{"email":"admin@store.com","password":"admin123"}'
$aresp = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/api/auth/login' -Method Post -ContentType 'application/json' -Body $abody -UseBasicParsing
$admin = $aresp.Content | ConvertFrom-Json
$headers = @{ Authorization = "Bearer $($admin.access_token)" }
$stats = (Invoke-WebRequest -Uri 'http://127.0.0.1:8000/api/admin/stats' -Headers $headers -UseBasicParsing).Content | ConvertFrom-Json
Write-Host ("products={0} orders={1} users={2} revenue={3} pending={4}" -f $stats.products, $stats.orders, $stats.users, $stats.revenue, $stats.pending_orders)

Write-Host "`n=== Filter: Makeup category ==="
$mk = (Invoke-WebRequest -Uri 'http://127.0.0.1:8000/api/products?category=makeup' -UseBasicParsing).Content | ConvertFrom-Json
Write-Host ("Makeup products: {0}" -f $mk.Count)

Write-Host "`nAll smoke tests passed."
