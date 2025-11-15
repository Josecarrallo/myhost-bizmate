# Script para probar el webhook de n8n
# Asegurate de que el workflow este ACTIVO en n8n antes de ejecutar

# URL del webhook de PRODUCCION (requiere workflow activo)
$productionUrl = "http://n8n-production-bb2d.up.railway.app/webhook/new_property"

# URL del webhook de TEST (requiere hacer click en "Listen for Test Event")
$testUrl = "http://n8n-production-bb2d.up.railway.app/webhook-test/new_property"

# Datos de prueba
$body = @{
    property_id = "TEST123"
    property_name = "Villa Test Prueba"
    location = "Marbella, España"
    price = 250000
    created_at = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
} | ConvertTo-Json

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST WEBHOOK N8N - MY HOST BIZMATE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Probar con la URL de PRODUCCION
Write-Host "1. Probando PRODUCTION URL..." -ForegroundColor Yellow
Write-Host "   URL: $productionUrl" -ForegroundColor Gray
Write-Host "   IMPORTANTE: El workflow debe estar ACTIVO" -ForegroundColor Red
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $productionUrl -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "   ✓ SUCCESS!" -ForegroundColor Green
    Write-Host "   Response:" -ForegroundColor Green
    $response | ConvertTo-Json | Write-Host -ForegroundColor Green
}
catch {
    Write-Host "   ✗ ERROR:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red

    if ($_.Exception.Message -like "*This webhook is not registered*") {
        Write-Host ""
        Write-Host "   DIAGNOSTICO:" -ForegroundColor Yellow
        Write-Host "   - El workflow NO esta activo en n8n" -ForegroundColor Yellow
        Write-Host "   - Ve a n8n y activa el workflow (toggle Active ON)" -ForegroundColor Yellow
        Write-Host "   - O usa la URL de TEST (ver opcion 2 abajo)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host ""

# Opcion para probar con URL de TEST
Write-Host "2. Opcion alternativa: TEST URL" -ForegroundColor Yellow
Write-Host "   URL: $testUrl" -ForegroundColor Gray
Write-Host "   PASOS:" -ForegroundColor Cyan
Write-Host "   1. Ve a n8n y abre el workflow" -ForegroundColor Cyan
Write-Host "   2. Haz click en 'Listen for Test Event' en el nodo Webhook" -ForegroundColor Cyan
Write-Host "   3. Ejecuta este comando en PowerShell:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Invoke-RestMethod -Uri '$testUrl' -Method POST -Body '$body' -ContentType 'application/json'" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
